from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q, Count, Avg
from .models import FloorAnnouncement, UserProfile
from .announcement_serializers import FloorAnnouncementSerializer, FloorAnnouncementListSerializer
from .permissions import IsFloorWing


class FloorAnnouncementViewSet(viewsets.ModelViewSet):
    """
    Floor Wing Announcements CRUD
    - Create, update, delete announcements
    - Scoped to floor wing's campus + floor
    """
    permission_classes = [IsAuthenticated, IsFloorWing]
    serializer_class = FloorAnnouncementSerializer
    
    def get_queryset(self):
        """Return announcements for floor wing's campus and floor only"""
        user = self.request.user
        return FloorAnnouncement.objects.filter(
            campus=user.profile.campus,
            floor=user.profile.floor,
            floor_wing=user
        ).select_related('floor_wing')
    
    def get_serializer_class(self):
        """Use lightweight serializer for list view"""
        if self.action == 'list':
            return FloorAnnouncementListSerializer
        return FloorAnnouncementSerializer
    
    def perform_create(self, serializer):
        """Save announcement with auto-set campus/floor"""
        serializer.save()
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get announcement statistics for floor wing"""
        user = request.user
        queryset = self.get_queryset()
        
        total = queryset.count()
        published = queryset.filter(status='published').count()
        drafts = queryset.filter(status='draft').count()
        
        # Get read statistics
        published_announcements = queryset.filter(status='published')
        total_reads = sum(a.read_count for a in published_announcements)
        
        # Get student count on floor
        student_count = UserProfile.objects.filter(
            campus=user.profile.campus,
            floor=user.profile.floor,
            role='STUDENT'
        ).count()
        
        return Response({
            'total_announcements': total,
            'published': published,
            'drafts': drafts,
            'total_reads': total_reads,
            'students_on_floor': student_count,
            'avg_read_rate': round((total_reads / (published * student_count)) * 100, 1) if published and student_count else 0
        })


class StudentAnnouncementViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Student-facing announcements
    - Read-only
    - Scoped to student's campus + floor
    """
    permission_classes = [IsAuthenticated]
    serializer_class = FloorAnnouncementSerializer
    
    def get_queryset(self):
        """Return published announcements for student's campus and floor"""
        user = self.request.user
        
        # Students see announcements for their floor
        if user.profile.role == 'STUDENT':
            return FloorAnnouncement.objects.filter(
                campus=user.profile.campus,
                floor=user.profile.floor,
                status='published'
            ).filter(
                Q(expires_at__isnull=True) | Q(expires_at__gt=timezone.now())
            ).select_related('floor_wing').order_by('-created_at')
        
        return FloorAnnouncement.objects.none()
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark announcement as read by student"""
        announcement = self.get_object()
        announcement.mark_as_read(request.user)
        return Response({'status': 'marked as read'})
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread announcements"""
        queryset = self.get_queryset()
        unread = queryset.exclude(read_by=request.user).count()
        return Response({'unread_count': unread})
