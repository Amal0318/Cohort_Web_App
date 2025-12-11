from rest_framework import serializers
from .models import UserProfile
from django.contrib.auth.models import User


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile"""
    
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'username', 'email', 'first_name', 'last_name',
            'leetcode_id', 'github_id', 'linkedin_id',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating UserProfile"""
    
    class Meta:
        model = UserProfile
        fields = ['leetcode_id', 'github_id', 'linkedin_id']
    
    def validate_leetcode_id(self, value):
        """Validate LeetCode ID format"""
        if value and len(value) < 3:
            raise serializers.ValidationError("LeetCode ID must be at least 3 characters")
        return value
    
    def validate_github_id(self, value):
        """Validate GitHub ID format"""
        if value and len(value) < 3:
            raise serializers.ValidationError("GitHub ID must be at least 3 characters")
        return value
