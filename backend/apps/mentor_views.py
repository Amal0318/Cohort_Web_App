"""
Mentor-specific views for reviewing student submissions across all pillars
This file consolidates mentor review APIs for: CFC, CLT, SRI, IIPC, SCD
"""

from django.contrib.auth.models import User
from django.db.models import Q, Count, Case, When, Value, IntegerField
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.cfc.models import HackathonSubmission, BMCVideoSubmission, InternshipSubmission, GenAIProjectSubmission
from apps.cfc.serializers import (
    HackathonSubmissionSerializer, 
    BMCVideoSubmissionSerializer,
    InternshipSubmissionSerializer,
    GenAIProjectSubmissionSerializer
)
from apps.clt.models import CLTSubmission
from apps.clt.serializers import CLTSubmissionSerializer
from apps.iipc.models import LinkedInPostVerification
from apps.iipc.serializers import LinkedInPostVerificationSerializer
from apps.scd.models import LeetCodeProfile
from apps.scd.serializers import LeetCodeProfileSerializer


# Helper function to check if user is a mentor
def is_mentor(user):
    """Check if user has mentor privileges"""
    return user.is_staff or user.is_superuser or hasattr(user, 'is_mentor')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pillar_submissions(request, pillar):
    """
    Get all submissions for a specific pillar for mentor review
    
    Pillars: cfc, clt, iipc, scd, all (sri not implemented yet)
    Query params:
        - status: filter by status (pending, approved, rejected, all)
        - search: search by student name or title
        - year: filter by student year
        - sort: latest or oldest
    """
    # Check if user is mentor
    if not is_mentor(request.user):
        return Response(
            {"error": "You don't have permission to access this resource"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Get query parameters
    status_filter = request.GET.get('status', 'all')
    search_query = request.GET.get('search', '')
    year_filter = request.GET.get('year', 'all')
    sort_order = request.GET.get('sort', 'latest')
    
    submissions = []
    
    # Map status filters
    status_map = {
        'pending': ['draft', 'submitted', 'under_review', 'pending'],
        'approved': ['approved'],
        'rejected': ['rejected'],
        'all': None
    }
    
    status_values = status_map.get(status_filter, None)
    
    print(f"\n=== BACKEND: Fetching submissions for pillar='{pillar}', status='{status_filter}' ===")
    
    # Get mentor's assigned students
    assigned_students = request.user.mentored_students.all().values_list('user_id', flat=True)
    if not assigned_students:
        print(f"⚠️ Mentor {request.user.username} has no assigned students")
        return Response({'submissions': [], 'total': 0})
    
    print(f"👥 Mentor {request.user.username} has {len(assigned_students)} assigned students")
    
    # Helper function to format submission data
    def format_submission(sub, pillar_type, model_type):
        # Get user profile info
        user_profile = {
            'name': sub.user.get_full_name() or sub.user.username,
            'avatar': sub.user.first_name[0].upper() if sub.user.first_name else sub.user.username[0].upper(),
            'email': sub.user.email,
            'username': sub.user.username,
        }
        
        # Map status to frontend format
        if sub.status in ['draft', 'submitted', 'under_review', 'pending']:
            frontend_status = 'pending'
        elif sub.status == 'approved':
            frontend_status = 'approved'
        elif sub.status == 'rejected':
            frontend_status = 'rejected'
        else:
            frontend_status = 'pending'
        
        # Get title based on model type
        title = ''
        description = ''
        if model_type == 'hackathon':
            title = sub.hackathon_name
            description = f"{sub.mode.title()} hackathon participation"
        elif model_type == 'bmc':
            title = "Business Model Canvas Video"
            description = sub.description or "BMC video submission"
        elif model_type == 'internship':
            title = f"Internship at {sub.company}"
            description = sub.role
        elif model_type == 'genai':
            title = "GenAI Project"
            description = sub.problem_statement[:100] if len(sub.problem_statement) > 100 else sub.problem_statement
        elif model_type == 'clt':
            title = sub.title
            description = sub.description
        elif model_type == 'linkedin':
            title = "LinkedIn Post Verification"
            description = f"Post from {sub.post_date}"
        elif model_type == 'leetcode':
            title = f"LeetCode Profile - {sub.leetcode_username}"
            description = f"Total solved: {sub.total_solved}"
        
        # Count evidence
        evidence_count = {'images': 0, 'links': 0}
        if hasattr(sub, 'certificate_link') and sub.certificate_link:
            evidence_count['links'] += 1
        if hasattr(sub, 'github_repo') and sub.github_repo:
            evidence_count['links'] += 1
        if hasattr(sub, 'video_url') and sub.video_url:
            evidence_count['links'] += 1
        if hasattr(sub, 'post_url') and sub.post_url:
            evidence_count['links'] += 1
        if hasattr(sub, 'screenshot_url') and sub.screenshot_url:
            evidence_count['links'] += 1
        
        return {
            'id': f"{pillar_type}_{model_type}_{sub.id}",  # Unique composite key
            'dbId': sub.id,  # Original DB ID for updates
            'modelType': model_type,  # For backend operations
            'student': user_profile,
            'title': title,
            'description': description,
            'submittedDate': sub.submitted_at.date() if sub.submitted_at else sub.created_at.date(),
            'status': frontend_status,
            'pillar': pillar_type,
            'evidenceLinks': evidence_count,
            'reviewerComments': getattr(sub, 'reviewer_comments', None) or getattr(sub, 'review_comments', '') or '',
            'reviewedAt': getattr(sub, 'reviewed_at', None),
        }
    
    # Get submissions based on pillar - FIXED: Use if-elif-else for proper isolation
    # FILTER BY ASSIGNED STUDENTS ONLY
    if pillar == 'all':
        # Get ALL submissions from all pillars (only from assigned students)
        cfc_qs = HackathonSubmission.objects.select_related('user').filter(user_id__in=assigned_students)
        bmc_qs = BMCVideoSubmission.objects.select_related('user').filter(user_id__in=assigned_students)
        internship_qs = InternshipSubmission.objects.select_related('user').filter(user_id__in=assigned_students)
        genai_qs = GenAIProjectSubmission.objects.select_related('user').filter(user_id__in=assigned_students)
        
        if status_values:
            cfc_qs = cfc_qs.filter(status__in=status_values)
            bmc_qs = bmc_qs.filter(status__in=status_values)
            internship_qs = internship_qs.filter(status__in=status_values)
            genai_qs = genai_qs.filter(status__in=status_values)
        
        submissions.extend([format_submission(s, 'cfc', 'hackathon') for s in cfc_qs])
        submissions.extend([format_submission(s, 'cfc', 'bmc') for s in bmc_qs])
        submissions.extend([format_submission(s, 'cfc', 'internship') for s in internship_qs])
        submissions.extend([format_submission(s, 'cfc', 'genai') for s in genai_qs])
        
        clt_qs = CLTSubmission.objects.select_related('user').filter(user_id__in=assigned_students)
        if status_values:
            clt_qs = clt_qs.filter(status__in=status_values)
        submissions.extend([format_submission(s, 'clt', 'clt') for s in clt_qs])
        
        iipc_qs = LinkedInPostVerification.objects.select_related('user').filter(user_id__in=assigned_students)
        if status_values:
            iipc_qs = iipc_qs.filter(status__in=status_values)
        submissions.extend([format_submission(s, 'iipc', 'linkedin') for s in iipc_qs])
        
        scd_qs = LeetCodeProfile.objects.select_related('user').filter(user_id__in=assigned_students)
        if status_values:
            scd_qs = scd_qs.filter(status__in=status_values)
        submissions.extend([format_submission(s, 'scd', 'leetcode') for s in scd_qs])
    
    elif pillar == 'cfc':
        # Get ONLY CFC submissions (from assigned students)
        cfc_qs = HackathonSubmission.objects.select_related('user').filter(user_id__in=assigned_students)
        bmc_qs = BMCVideoSubmission.objects.select_related('user').filter(user_id__in=assigned_students)
        internship_qs = InternshipSubmission.objects.select_related('user').filter(user_id__in=assigned_students)
        genai_qs = GenAIProjectSubmission.objects.select_related('user').filter(user_id__in=assigned_students)
        
        if status_values:
            cfc_qs = cfc_qs.filter(status__in=status_values)
            bmc_qs = bmc_qs.filter(status__in=status_values)
            internship_qs = internship_qs.filter(status__in=status_values)
            genai_qs = genai_qs.filter(status__in=status_values)
        
        submissions.extend([format_submission(s, 'cfc', 'hackathon') for s in cfc_qs])
        submissions.extend([format_submission(s, 'cfc', 'bmc') for s in bmc_qs])
        submissions.extend([format_submission(s, 'cfc', 'internship') for s in internship_qs])
        submissions.extend([format_submission(s, 'cfc', 'genai') for s in genai_qs])
    
    elif pillar == 'clt':
        # Get ONLY CLT submissions (from assigned students)
        clt_qs = CLTSubmission.objects.select_related('user').filter(user_id__in=assigned_students)
        if status_values:
            clt_qs = clt_qs.filter(status__in=status_values)
        submissions.extend([format_submission(s, 'clt', 'clt') for s in clt_qs])
    
    elif pillar == 'iipc':
        # Get ONLY IIPC submissions (from assigned students)
        iipc_qs = LinkedInPostVerification.objects.select_related('user').filter(user_id__in=assigned_students)
        if status_values:
            iipc_qs = iipc_qs.filter(status__in=status_values)
        submissions.extend([format_submission(s, 'iipc', 'linkedin') for s in iipc_qs])
    
    elif pillar == 'scd':
        # Get ONLY SCD submissions (from assigned students)
        scd_qs = LeetCodeProfile.objects.select_related('user').filter(user_id__in=assigned_students)
        if status_values:
            scd_qs = scd_qs.filter(status__in=status_values)
        submissions.extend([format_submission(s, 'scd', 'leetcode') for s in scd_qs])
    
    # SRI not implemented yet
    
    # Apply search filter
    if search_query:
        search_lower = search_query.lower()
        submissions = [
            s for s in submissions 
            if search_lower in s['student']['name'].lower() 
            or search_lower in s['title'].lower()
            or search_lower in s['description'].lower()
        ]
    
    # Sort submissions
    if sort_order == 'latest':
        submissions.sort(key=lambda x: x['submittedDate'], reverse=True)
    else:
        submissions.sort(key=lambda x: x['submittedDate'])
    
    # Debug logging
    print(f"\n=== BACKEND: Returning {len(submissions)} submissions for pillar '{pillar}' ===")
    if submissions:
        pillar_counts = {}
        for s in submissions:
            p = s['pillar']
            pillar_counts[p] = pillar_counts.get(p, 0) + 1
        print(f"Pillar breakdown: {pillar_counts}")
    
    return Response({
        'submissions': submissions,
        'total': len(submissions)
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pillar_stats(request, pillar):
    """
    Get statistics for a specific pillar
    Returns: total, pending, approved, rejected counts
    """
    if not is_mentor(request.user):
        return Response(
            {"error": "You don't have permission to access this resource"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Get mentor's assigned students
    assigned_students = request.user.mentored_students.all().values_list('user_id', flat=True)
    if not assigned_students:
        return Response({'total': 0, 'pending': 0, 'approved': 0, 'rejected': 0})
    
    stats = {'total': 0, 'pending': 0, 'approved': 0, 'rejected': 0}
    
    def count_submissions(queryset):
        return {
            'total': queryset.count(),
            'pending': queryset.filter(status__in=['draft', 'submitted', 'under_review', 'pending']).count(),
            'approved': queryset.filter(status='approved').count(),
            'rejected': queryset.filter(status='rejected').count(),
        }
    
    def add_stats(s1, s2):
        return {k: s1[k] + s2[k] for k in s1}
    
    # Use if-elif-else for proper pillar isolation and filter by assigned students
    if pillar == 'all':
        stats = add_stats(stats, count_submissions(HackathonSubmission.objects.filter(user_id__in=assigned_students)))
        stats = add_stats(stats, count_submissions(BMCVideoSubmission.objects.filter(user_id__in=assigned_students)))
        stats = add_stats(stats, count_submissions(InternshipSubmission.objects.filter(user_id__in=assigned_students)))
        stats = add_stats(stats, count_submissions(GenAIProjectSubmission.objects.filter(user_id__in=assigned_students)))
        stats = add_stats(stats, count_submissions(CLTSubmission.objects.filter(user_id__in=assigned_students)))
        stats = add_stats(stats, count_submissions(LinkedInPostVerification.objects.filter(user_id__in=assigned_students)))
        stats = add_stats(stats, count_submissions(LeetCodeProfile.objects.filter(user_id__in=assigned_students)))
    
    elif pillar == 'cfc':
        stats = add_stats(stats, count_submissions(HackathonSubmission.objects.filter(user_id__in=assigned_students)))
        stats = add_stats(stats, count_submissions(BMCVideoSubmission.objects.filter(user_id__in=assigned_students)))
        stats = add_stats(stats, count_submissions(InternshipSubmission.objects.filter(user_id__in=assigned_students)))
        stats = add_stats(stats, count_submissions(GenAIProjectSubmission.objects.filter(user_id__in=assigned_students)))
    
    elif pillar == 'clt':
        stats = add_stats(stats, count_submissions(CLTSubmission.objects.filter(user_id__in=assigned_students)))
    
    elif pillar == 'iipc':
        stats = add_stats(stats, count_submissions(LinkedInPostVerification.objects.filter(user_id__in=assigned_students)))
    
    elif pillar == 'scd':
        stats = add_stats(stats, count_submissions(LeetCodeProfile.objects.filter(user_id__in=assigned_students)))
    
    # SRI not implemented yet
    
    return Response(stats)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def review_submission(request):
    """
    Review a submission (approve/reject)
    
    Body:
        - pillar: cfc, clt, iipc, scd
        - submission_id: ID of the submission
        - submission_type: hackathon, bmc, internship, genai, clt, linkedin, leetcode
        - action: approve or reject
        - comment: reviewer comment (required for reject)
    """
    if not is_mentor(request.user):
        return Response(
            {"error": "You don't have permission to access this resource"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    pillar = request.data.get('pillar')
    submission_id = request.data.get('submission_id')
    submission_type = request.data.get('submission_type')
    action = request.data.get('action')  # 'approve' or 'reject'
    comment = request.data.get('comment', '')
    
    if not all([pillar, submission_id, submission_type, action]):
        return Response(
            {"error": "Missing required fields"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if action == 'reject' and not comment:
        return Response(
            {"error": "Comment is required for rejection"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Get the submission model based on type
    model_map = {
        'hackathon': HackathonSubmission,
        'bmc': BMCVideoSubmission,
        'internship': InternshipSubmission,
        'genai': GenAIProjectSubmission,
        'clt': CLTSubmission,
        'linkedin': LinkedInPostVerification,
        'leetcode': LeetCodeProfile,
    }
    
    model_class = model_map.get(submission_type)
    if not model_class:
        return Response(
            {"error": "Invalid submission type"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        submission = model_class.objects.get(id=submission_id)
    except model_class.DoesNotExist:
        return Response(
            {"error": "Submission not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Update submission
    submission.status = 'approved' if action == 'approve' else 'rejected'
    
    # Handle different field names for comments
    if hasattr(submission, 'reviewer_comments'):
        submission.reviewer_comments = comment
    elif hasattr(submission, 'review_comments'):
        submission.review_comments = comment
    
    # Handle different field names for reviewer
    if hasattr(submission, 'reviewed_by'):
        submission.reviewed_by = request.user
    elif hasattr(submission, 'reviewer'):
        submission.reviewer = request.user
    
    if hasattr(submission, 'reviewed_at'):
        submission.reviewed_at = timezone.now()
    
    submission.save()
    
    return Response({
        'message': f'Submission {action}d successfully',
        'submission_id': submission_id,
        'status': submission.status
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_submission_detail(request, pillar, submission_type, submission_id):
    """
    Get detailed information about a specific submission
    """
    if not is_mentor(request.user):
        return Response(
            {"error": "You don't have permission to access this resource"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    model_map = {
        'hackathon': HackathonSubmission,
        'bmc': BMCVideoSubmission,
        'internship': InternshipSubmission,
        'genai': GenAIProjectSubmission,
        'clt': CLTSubmission,
        'linkedin': LinkedInPostVerification,
        'leetcode': LeetCodeProfile,
    }
    
    serializer_map = {
        'hackathon': HackathonSubmissionSerializer,
        'bmc': BMCVideoSubmissionSerializer,
        'internship': InternshipSubmissionSerializer,
        'genai': GenAIProjectSubmissionSerializer,
        'clt': CLTSubmissionSerializer,
        'linkedin': LinkedInPostVerificationSerializer,
        'leetcode': LeetCodeProfileSerializer,
    }
    
    model_class = model_map.get(submission_type)
    serializer_class = serializer_map.get(submission_type)
    
    if not model_class or not serializer_class:
        return Response(
            {"error": "Invalid submission type"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        submission = model_class.objects.select_related('user').get(id=submission_id)
    except model_class.DoesNotExist:
        return Response(
            {"error": "Submission not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = serializer_class(submission)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_mentor_students(request):
    """
    Get list of students assigned to the current mentor with their progress stats
    """
    if not is_mentor(request.user):
        return Response(
            {"error": "You don't have permission to access this resource"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Get mentor's assigned students
    assigned_students = request.user.mentored_students.all().select_related('user')
    
    students_data = []
    for profile in assigned_students:
        student = profile.user
        
        # Get submission stats for each pillar
        clt_submissions = CLTSubmission.objects.filter(user=student)
        clt_stats = {
            'status': 'completed' if clt_submissions.filter(status='approved').exists() 
                     else 'pending' if clt_submissions.filter(status__in=['draft', 'submitted', 'under_review']).exists()
                     else 'not-started',
            'count': clt_submissions.count(),
            'lastSubmission': clt_submissions.order_by('-created_at').first().created_at if clt_submissions.exists() else None
        }
        
        # CFC stats (all types combined)
        hackathons = HackathonSubmission.objects.filter(user=student)
        bmc_videos = BMCVideoSubmission.objects.filter(user=student)
        internships = InternshipSubmission.objects.filter(user=student)
        genai_projects = GenAIProjectSubmission.objects.filter(user=student)
        
        cfc_total = hackathons.count() + bmc_videos.count() + internships.count() + genai_projects.count()
        cfc_approved = (hackathons.filter(status='approved').count() + 
                       bmc_videos.filter(status='approved').count() +
                       internships.filter(status='approved').count() +
                       genai_projects.filter(status='approved').count())
        cfc_pending = cfc_total - cfc_approved
        
        cfc_stats = {
            'status': 'completed' if cfc_approved > 0 
                     else 'pending' if cfc_pending > 0
                     else 'not-started',
            'count': cfc_total,
            'lastSubmission': max(
                [s.created_at for s in list(hackathons) + list(bmc_videos) + list(internships) + list(genai_projects)],
                default=None
            )
        }
        
        # IIPC stats
        iipc_posts = LinkedInPostVerification.objects.filter(user=student)
        iipc_stats = {
            'status': 'completed' if iipc_posts.filter(status='verified').exists()
                     else 'pending' if iipc_posts.filter(status='pending').exists()
                     else 'not-started',
            'count': iipc_posts.count(),
            'lastSubmission': iipc_posts.order_by('-created_at').first().created_at if iipc_posts.exists() else None
        }
        
        # SCD stats
        try:
            leetcode_profile = LeetCodeProfile.objects.get(user=student)
            scd_stats = {
                'status': 'completed' if leetcode_profile.monthly_problems_count >= 10 else 'pending',
                'count': leetcode_profile.total_solved,
                'lastSubmission': leetcode_profile.last_synced
            }
        except LeetCodeProfile.DoesNotExist:
            scd_stats = {
                'status': 'not-started',
                'count': 0,
                'lastSubmission': None
            }
        
        # SRI stats (placeholder - not implemented yet)
        sri_stats = {
            'status': 'not-started',
            'count': 0,
            'lastSubmission': None
        }
        
        students_data.append({
            'id': student.id,
            'name': student.get_full_name() or student.username,
            'email': student.email,
            'username': student.username,
            'rollNo': f'STU{student.id:03d}',  # Generate roll number from ID
            'submissions': {
                'clt': clt_stats,
                'sri': sri_stats,
                'cfc': cfc_stats,
                'iipc': iipc_stats,
                'scd': scd_stats,
            }
        })
    
    return Response({
        'students': students_data,
        'total': len(students_data)
    })
