#!/usr/bin/env python
"""
Automatically assign unassigned students to mentors on their floor
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from apps.profiles.models import UserProfile

print("\n=== Auto-Assigning Students to Mentors ===\n")

# Process each campus and floor
for campus_code, campus_name in UserProfile.CAMPUS_CHOICES:
    floors = [1, 2, 3, 4] if campus_code == 'TECH' else [1, 2, 3]
    
    for floor in floors:
        print(f"\n{campus_name} - Floor {floor}:")
        
        # Get mentors on this floor
        mentors = list(UserProfile.objects.filter(
            role='MENTOR',
            campus=campus_code,
            floor=floor
        ).select_related('user'))
        
        if not mentors:
            print(f"  ⚠ No mentors found")
            continue
        
        print(f"  Found {len(mentors)} mentor(s)")
        
        # Get unassigned students on this floor
        unassigned_students = UserProfile.objects.filter(
            role='STUDENT',
            campus=campus_code,
            floor=floor,
            assigned_mentor__isnull=True
        ).select_related('user')
        
        if not unassigned_students.exists():
            print(f"  ✓ All students already assigned")
            continue
        
        print(f"  Found {unassigned_students.count()} unassigned student(s)")
        
        # Distribute students evenly among mentors
        assigned_count = 0
        for index, student_profile in enumerate(unassigned_students):
            # Round-robin assignment
            mentor_profile = mentors[index % len(mentors)]
            student_profile.assigned_mentor = mentor_profile.user
            student_profile.save()
            assigned_count += 1
        
        print(f"  ✅ Assigned {assigned_count} students to {len(mentors)} mentors")
        
        # Show distribution
        for mentor_profile in mentors:
            student_count = UserProfile.objects.filter(
                role='STUDENT',
                campus=campus_code,
                floor=floor,
                assigned_mentor=mentor_profile.user
            ).count()
            print(f"     - {mentor_profile.user.get_full_name()}: {student_count} students")

print("\n✅ Done! All unassigned students have been assigned to mentors.\n")
