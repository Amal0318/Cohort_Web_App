from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.db.models import Count, Q
from apps.profiles.models import UserProfile
from apps.profiles.permissions import IsAdmin


class AdminCampusOverviewView(APIView):
    """Admin view to see campus-level overview"""
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def get(self, request, campus):
        if campus not in ['TECH', 'ARTS']:
            return Response({
                'error': 'Invalid campus. Must be TECH or ARTS'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Determine floor range based on campus
        if campus == 'TECH':
            floors = [1, 2, 3, 4]
            campus_name = 'SNS College of Technology'
        else:
            floors = [1, 2, 3]
            campus_name = 'SNS College of Arts & Science'
        
        floor_data = []
        for floor_num in floors:
            # Get counts for this floor
            students_count = UserProfile.objects.filter(
                role='STUDENT',
                campus=campus,
                floor=floor_num
            ).count()
            
            mentors_count = UserProfile.objects.filter(
                role='MENTOR',
                campus=campus,
                floor=floor_num
            ).count()
            
            floor_wing = UserProfile.objects.filter(
                role='FLOOR_WING',
                campus=campus,
                floor=floor_num
            ).select_related('user').first()
            
            floor_wing_name = None
            if floor_wing:
                floor_wing_name = f"{floor_wing.user.first_name} {floor_wing.user.last_name}"
            
            # Calculate submission stats (placeholder - implement based on your models)
            submission_stats = self._get_floor_submission_stats(campus, floor_num)
            
            floor_data.append({
                'floor': floor_num,
                'floor_name': f"{floor_num}st Year" if floor_num == 1 else f"{floor_num}nd Year" if floor_num == 2 else f"{floor_num}rd Year" if floor_num == 3 else f"{floor_num}th Year",
                'total_students': students_count,
                'total_mentors': mentors_count,
                'floor_wing': floor_wing_name,
                'floor_wing_id': floor_wing.user.id if floor_wing else None,
                'submissions': submission_stats
            })
        
        return Response({
            'campus': campus,
            'campus_name': campus_name,
            'floors': floor_data
        }, status=status.HTTP_200_OK)
    
    def _get_floor_submission_stats(self, campus, floor):
        """Get submission statistics for a floor"""
        # Placeholder - implement based on your actual submission models
        return {
            'total': 0,
            'pending': 0,
            'approved': 0,
            'rejected': 0,
            'progress_percentage': 0
        }


class AdminFloorDetailView(APIView):
    """Admin view for detailed floor information"""
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def get(self, request, campus, floor):
        if campus not in ['TECH', 'ARTS']:
            return Response({
                'error': 'Invalid campus'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate floor range
        if campus == 'TECH' and floor not in [1, 2, 3, 4]:
            return Response({
                'error': 'Tech campus only has floors 1-4'
            }, status=status.HTTP_400_BAD_REQUEST)
        if campus == 'ARTS' and floor not in [1, 2, 3]:
            return Response({
                'error': 'Arts campus only has floors 1-3'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get floor wing
        floor_wing = UserProfile.objects.filter(
            role='FLOOR_WING',
            campus=campus,
            floor=floor
        ).select_related('user').first()
        
        # Get mentors on this floor
        mentors = UserProfile.objects.filter(
            role='MENTOR',
            campus=campus,
            floor=floor
        ).select_related('user')
        
        mentor_data = []
        for mentor_profile in mentors:
            # Count students assigned to this mentor on this floor
            student_count = UserProfile.objects.filter(
                role='STUDENT',
                campus=campus,
                floor=floor,
                assigned_mentor=mentor_profile.user
            ).count()
            
            mentor_data.append({
                'id': mentor_profile.user.id,
                'name': f"{mentor_profile.user.first_name} {mentor_profile.user.last_name}",
                'email': mentor_profile.user.email,
                'assigned_students': student_count
            })
        
        # Get students
        students = UserProfile.objects.filter(
            role='STUDENT',
            campus=campus,
            floor=floor
        ).select_related('user', 'assigned_mentor')
        
        student_data = []
        for student_profile in students:
            mentor_name = None
            if student_profile.assigned_mentor:
                mentor = student_profile.assigned_mentor
                mentor_name = f"{mentor.first_name} {mentor.last_name}"
            
            student_data.append({
                'id': student_profile.user.id,
                'name': f"{student_profile.user.first_name} {student_profile.user.last_name}",
                'email': student_profile.user.email,
                'mentor': mentor_name,
                'mentor_id': student_profile.assigned_mentor.id if student_profile.assigned_mentor else None
            })
        
        floor_wing_data = None
        if floor_wing:
            floor_wing_data = {
                'id': floor_wing.user.id,
                'name': f"{floor_wing.user.first_name} {floor_wing.user.last_name}",
                'email': floor_wing.user.email
            }
        
        return Response({
            'campus': campus,
            'floor': floor,
            'floor_wing': floor_wing_data,
            'mentors': mentor_data,
            'students': student_data,
            'stats': {
                'total_students': len(student_data),
                'total_mentors': len(mentor_data),
                'unassigned_students': sum(1 for s in student_data if not s['mentor_id'])
            }
        }, status=status.HTTP_200_OK)


class AdminAssignFloorWingView(APIView):
    """Admin endpoint to assign Floor Wing to a floor"""
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def post(self, request):
        campus = request.data.get('campus')
        floor = request.data.get('floor')
        user_id = request.data.get('user_id')
        
        if not all([campus, floor, user_id]):
            return Response({
                'error': 'campus, floor, and user_id are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(id=user_id)
            profile = user.profile
            
            # Check if there's already a floor wing for this floor
            existing_floor_wing = UserProfile.objects.filter(
                role='FLOOR_WING',
                campus=campus,
                floor=floor
            ).exclude(user=user).first()
            
            if existing_floor_wing:
                return Response({
                    'error': f'Floor {floor} already has a Floor Wing assigned'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Update user profile
            profile.role = 'FLOOR_WING'
            profile.campus = campus
            profile.floor = floor
            profile.save()
            
            return Response({
                'success': True,
                'message': f'{user.first_name} {user.last_name} assigned as Floor Wing for {campus} Floor {floor}'
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)


class AdminAssignMentorView(APIView):
    """Admin endpoint to assign Mentor to a floor"""
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def post(self, request):
        campus = request.data.get('campus')
        floor = request.data.get('floor')
        user_id = request.data.get('user_id')
        
        if not all([campus, floor, user_id]):
            return Response({
                'error': 'campus, floor, and user_id are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(id=user_id)
            profile = user.profile
            
            # Update user profile
            profile.role = 'MENTOR'
            profile.campus = campus
            profile.floor = floor
            profile.save()
            
            return Response({
                'success': True,
                'message': f'{user.first_name} {user.last_name} assigned as Mentor for {campus} Floor {floor}'
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)


class AdminStudentDetailView(APIView):
    """Admin view to get detailed student information"""
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def get(self, request, student_id):
        try:
            user = User.objects.get(id=student_id)
            
            # Check if user has profile
            try:
                profile = user.profile
            except AttributeError:
                return Response({
                    'error': 'User profile not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Get mentor info
            mentor_info = None
            if hasattr(profile, 'assigned_mentor') and profile.assigned_mentor:
                mentor = profile.assigned_mentor
                mentor_info = {
                    'id': mentor.id,
                    'name': f"{mentor.first_name} {mentor.last_name}",
                    'email': mentor.email
                }
            
            # Get pillar progress (placeholder - implement based on your submission models)
            pillar_details = self._get_pillar_progress(profile)
            
            # Get submission counts
            submission_stats = self._get_submission_stats(profile)
            
            # Get campus name safely
            campus_name = 'N/A'
            if profile.campus:
                campus_name = 'SNS College of Technology' if profile.campus == 'TECH' else 'SNS College of Arts & Science'
            
            return Response({
                'id': user.id,
                'name': f"{user.first_name} {user.last_name}",
                'email': user.email,
                'username': user.username,
                'roll_no': user.username or 'N/A',
                'campus': profile.campus or 'N/A',
                'campus_name': campus_name,
                'floor': profile.floor or 'N/A',
                'role': profile.role,
                'assigned_mentor': mentor_info,
                'pillar_progress': pillar_details.get('overall', 0),
                'pillar_details': pillar_details.get('pillars', {}),
                'submission_stats': submission_stats,
                'xp_points': profile.xp_points or 0,
                'status': self._get_student_status(pillar_details.get('overall', 0))
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                'error': 'Student not found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    def _get_pillar_progress(self, profile):
        """Calculate pillar progress - placeholder implementation"""
        # TODO: Implement based on your submission models (CFC, CLT, SRI, IIPC, SCD)
        return {
            'overall': 0,
            'pillars': {
                'CFC': 0,
                'CLT': 0,
                'SRI': 0,
                'IIPC': 0,
                'SCD': 0
            }
        }
    
    def _get_submission_stats(self, profile):
        """Get submission statistics - placeholder implementation"""
        # TODO: Implement based on your submission models
        return {
            'total': 0,
            'approved': 0,
            'pending': 0,
            'rejected': 0
        }
    
    def _get_student_status(self, progress):
        """Determine student status based on progress"""
        if progress >= 80:
            return 'on_track'
        elif progress >= 50:
            return 'at_risk'
        else:
            return 'behind'
