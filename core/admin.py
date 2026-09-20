from django.contrib import admin
from .models import Service, Project, FutureProject, ResearchProject, BlogPost, Hero, CompanyInfo, ContactMessage


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'display_order', 'active')
    list_editable = ('category', 'display_order', 'active')
    list_filter = ('category', 'active')


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'display_order', 'active')
    list_editable = ('category', 'display_order', 'active')
    list_filter = ('category', 'active')


@admin.register(FutureProject)
class FutureProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'expected_date', 'display_order', 'active')
    list_editable = ('display_order', 'active')


@admin.register(ResearchProject)
class ResearchProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'active', 'updated_at')
    list_editable = ('active',)


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'published', 'display_order', 'created_at')
    list_editable = ('published', 'display_order')
    list_filter = ('published',)
    search_fields = ('title', 'content')


@admin.register(Hero)
class HeroAdmin(admin.ModelAdmin):
    list_display = ('title', 'active')
    list_editable = ('active',)


@admin.register(CompanyInfo)
class CompanyInfoAdmin(admin.ModelAdmin):
    list_display = ('key', 'value')
    search_fields = ('key',)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'read', 'created_at')
    list_editable = ('read',)
    list_filter = ('read',)
    search_fields = ('name', 'email', 'message')
