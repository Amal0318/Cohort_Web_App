"""
URL configuration for mentor-specific views
"""

from django.urls import path
from apps import mentor_views

app_name = 'mentor'

urlpatterns = [
    # Mentor students list
    path('students/', mentor_views.get_mentor_students, name='mentor-students'),
    
    # Pillar review endpoints
    path('pillar/<str:pillar>/submissions/', mentor_views.get_pillar_submissions, name='pillar-submissions'),
    path('pillar/<str:pillar>/stats/', mentor_views.get_pillar_stats, name='pillar-stats'),
    
    # Submission review
    path('review/', mentor_views.review_submission, name='review-submission'),
    
    # Submission detail
    path('submission/<str:pillar>/<str:submission_type>/<int:submission_id>/', 
         mentor_views.get_submission_detail, 
         name='submission-detail'),
]
