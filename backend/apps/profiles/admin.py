from django.contrib import admin
from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'leetcode_id', 'github_id', 'linkedin_id', 'updated_at']
    search_fields = ['user__username', 'user__email', 'leetcode_id', 'github_id', 'linkedin_id']
    list_filter = ['created_at', 'updated_at']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Platform IDs', {
            'fields': ('leetcode_id', 'github_id', 'linkedin_id')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
