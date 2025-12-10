from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User profile"""
    role = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'role']
        read_only_fields = ['id', 'is_staff', 'is_superuser', 'role']
    
    def get_role(self, obj):
        """Determine user role based on permissions"""
        if obj.is_superuser:
            return 'admin'
        elif obj.is_staff:
            return 'mentor'
        elif obj.groups.filter(name='floorwing').exists():
            return 'floorwing'
        else:
            return 'student'
