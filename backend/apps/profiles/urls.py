from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserProfileView
from .floor_wing_views import (
    FloorWingDashboardView,
    FloorWingStudentsView,
    FloorWingMentorsView,
    FloorWingAssignStudentView
)
from .admin_views import (
    AdminCampusOverviewView,
    AdminFloorDetailView,
    AdminAssignFloorWingView,
    AdminAssignMentorView,
    AdminStudentDetailView
)
from .announcement_views import FloorAnnouncementViewSet, StudentAnnouncementViewSet
from .notification_views import NotificationViewSet

app_name = 'profiles'

# Router for announcements and notifications
router = DefaultRouter()
router.register(r'floor-wing/announcements', FloorAnnouncementViewSet, basename='floor-announcements')
router.register(r'student/announcements', StudentAnnouncementViewSet, basename='student-announcements')
router.register(r'notifications', NotificationViewSet, basename='notifications')

urlpatterns = [
    path('me/', UserProfileView.as_view(), name='user-profile'),
    
    # Floor Wing routes
    path('floor-wing/dashboard/', FloorWingDashboardView.as_view(), name='floor-wing-dashboard'),
    path('floor-wing/students/', FloorWingStudentsView.as_view(), name='floor-wing-students'),
    path('floor-wing/mentors/', FloorWingMentorsView.as_view(), name='floor-wing-mentors'),
    path('floor-wing/assign-student/', FloorWingAssignStudentView.as_view(), name='floor-wing-assign-student'),
    
    # Admin routes
    path('admin/campus/<str:campus>/', AdminCampusOverviewView.as_view(), name='admin-campus-overview'),
    path('admin/campus/<str:campus>/floor/<int:floor>/', AdminFloorDetailView.as_view(), name='admin-floor-detail'),
    path('admin/assign-floor-wing/', AdminAssignFloorWingView.as_view(), name='admin-assign-floor-wing'),
    path('admin/assign-mentor/', AdminAssignMentorView.as_view(), name='admin-assign-mentor'),
    path('admin/student/<int:student_id>/', AdminStudentDetailView.as_view(), name='admin-student-detail'),
    
    # Announcement routes (via router)
    path('', include(router.urls)),
]
