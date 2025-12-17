from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from apps.dashboard.models import Notification
from apps.dashboard.serializers import NotificationSerializer


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    User notifications API
    - Get all notifications
    - Get unread count
    - Mark as read
    - Mark all as read
    """
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer
    
    def get_queryset(self):
        """Return notifications for current user"""
        return Notification.objects.filter(
            recipient=self.request.user
        )[:50]  # Limit to last 50 notifications
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread notifications"""
        count = Notification.objects.filter(
            recipient=request.user,
            is_read=False
        ).count()
        
        return Response({'unread_count': count})
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark a single notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        
        return Response({
            'status': 'success',
            'message': 'Notification marked as read'
        })
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all user's notifications as read"""
        updated = Notification.objects.filter(
            recipient=request.user,
            is_read=False
        ).update(is_read=True)
        
        return Response({
            'status': 'success',
            'message': f'{updated} notifications marked as read',
            'updated_count': updated
        })
    
    @action(detail=False, methods=['delete'])
    def clear_all(self, request):
        """Delete all read notifications"""
        deleted, _ = Notification.objects.filter(
            recipient=request.user,
            is_read=True
        ).delete()
        
        return Response({
            'status': 'success',
            'message': f'{deleted} notifications deleted',
            'deleted_count': deleted
        })
