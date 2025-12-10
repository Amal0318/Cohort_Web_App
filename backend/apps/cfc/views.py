from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q, Count

from .models import (
    HackathonSubmission,
    BMCVideoSubmission,
    InternshipSubmission,
    GenAIProjectSubmission
)
from .serializers import (
    HackathonSubmissionSerializer,
    HackathonSubmissionCreateSerializer,
    BMCVideoSubmissionSerializer,
    BMCVideoSubmissionCreateSerializer,
    InternshipSubmissionSerializer,
    InternshipSubmissionCreateSerializer,
    GenAIProjectSubmissionSerializer,
    GenAIProjectSubmissionCreateSerializer,
    CFCStatsSerializer
)


class HackathonSubmissionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Hackathon submissions
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return HackathonSubmission.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return HackathonSubmissionCreateSerializer
        return HackathonSubmissionSerializer
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submit a hackathon submission for review"""
        submission = self.get_object()
        
        # Validate required fields
        if not submission.certificate_link:
            return Response(
                {'error': 'Please provide a certificate link before submitting.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        submission.status = 'submitted'
        submission.submitted_at = timezone.now()
        submission.save()
        
        serializer = self.get_serializer(submission)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get hackathon submission statistics for the current user"""
        queryset = self.get_queryset()
        stats = {
            'total': queryset.count(),
            'draft': queryset.filter(status='draft').count(),
            'submitted': queryset.filter(status='submitted').count(),
            'approved': queryset.filter(status='approved').count(),
            'rejected': queryset.filter(status='rejected').count(),
        }
        return Response(stats)


class BMCVideoSubmissionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing BMC Video submissions
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return BMCVideoSubmission.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return BMCVideoSubmissionCreateSerializer
        return BMCVideoSubmissionSerializer
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submit a BMC video for review"""
        submission = self.get_object()
        
        # Validate required fields
        if not submission.video_url:
            return Response(
                {'error': 'Please provide a video URL before submitting.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        submission.status = 'submitted'
        submission.submitted_at = timezone.now()
        submission.save()
        
        serializer = self.get_serializer(submission)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get BMC video submission statistics for the current user"""
        queryset = self.get_queryset()
        stats = {
            'total': queryset.count(),
            'draft': queryset.filter(status='draft').count(),
            'submitted': queryset.filter(status='submitted').count(),
            'approved': queryset.filter(status='approved').count(),
            'rejected': queryset.filter(status='rejected').count(),
        }
        return Response(stats)


class InternshipSubmissionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Internship submissions
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return InternshipSubmission.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return InternshipSubmissionCreateSerializer
        return InternshipSubmissionSerializer
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submit an internship for review"""
        submission = self.get_object()
        
        # Validate that internship is completed (status 4)
        if submission.internship_status != 4:
            return Response(
                {'error': 'Internship must be completed before submitting for review.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate required documents for completed internships
        if not submission.completion_certificate_link:
            return Response(
                {'error': 'Please provide a completion certificate link before submitting.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        submission.status = 'submitted'
        submission.submitted_at = timezone.now()
        submission.save()
        
        serializer = self.get_serializer(submission)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update internship progress status"""
        submission = self.get_object()
        new_status = request.data.get('internship_status')
        
        if new_status is None:
            return Response(
                {'error': 'internship_status is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            new_status = int(new_status)
            if new_status not in [1, 2, 3, 4]:
                raise ValueError
        except (ValueError, TypeError):
            return Response(
                {'error': 'internship_status must be 1, 2, 3, or 4'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        submission.internship_status = new_status
        submission.save()
        
        serializer = self.get_serializer(submission)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get internship submission statistics for the current user"""
        queryset = self.get_queryset()
        stats = {
            'total': queryset.count(),
            'application': queryset.filter(internship_status=1).count(),
            'interview': queryset.filter(internship_status=2).count(),
            'offer': queryset.filter(internship_status=3).count(),
            'completed': queryset.filter(internship_status=4).count(),
            'approved': queryset.filter(status='approved').count(),
        }
        return Response(stats)


class GenAIProjectSubmissionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing GenAI Project submissions
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return GenAIProjectSubmission.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return GenAIProjectSubmissionCreateSerializer
        return GenAIProjectSubmissionSerializer
    
    def create(self, request, *args, **kwargs):
        """Override create to add detailed error logging"""
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(f"Validation errors: {serializer.errors}")
            print(f"Request data: {request.data}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submit a GenAI project for review"""
        submission = self.get_object()
        
        # Validate required fields
        if not submission.github_repo:
            return Response(
                {'error': 'Please provide a GitHub repository link before submitting.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not submission.problem_statement or not submission.innovation_technology:
            return Response(
                {'error': 'Please complete all required fields before submitting.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        submission.status = 'submitted'
        submission.submitted_at = timezone.now()
        submission.save()
        
        serializer = self.get_serializer(submission)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get GenAI project submission statistics for the current user"""
        queryset = self.get_queryset()
        stats = {
            'total': queryset.count(),
            'draft': queryset.filter(status='draft').count(),
            'submitted': queryset.filter(status='submitted').count(),
            'approved': queryset.filter(status='approved').count(),
            'rejected': queryset.filter(status='rejected').count(),
        }
        return Response(stats)
