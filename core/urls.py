from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('services/', views.services_page, name='services'),
    path('realisations/', views.realisations_page, name='realisations'),
    path('futurs-projets/', views.futurs_projets_page, name='futurs_projets'),
    path('blog/', views.blog_page, name='blog'),
    path('blog/<int:pk>/', views.blog_post_page, name='blog_post'),
    path('contact/', views.contact_page, name='contact'),
    # Admin
    path('admin-panel/login/', views.admin_login, name='admin_login'),
    path('admin-panel/logout/', views.admin_logout, name='admin_logout'),
    path('admin-panel/', views.admin_dashboard, name='admin_dashboard'),
    path('admin-panel/services/', views.admin_services, name='admin_services'),
    path('admin-panel/projects/', views.admin_projects, name='admin_projects'),
    path('admin-panel/future-projects/', views.admin_future_projects, name='admin_future_projects'),
    path('admin-panel/research/', views.admin_research, name='admin_research'),
    path('admin-panel/blog/', views.admin_blog, name='admin_blog'),
    path('admin-panel/hero/', views.admin_hero, name='admin_hero'),
    path('admin-panel/company/', views.admin_company, name='admin_company'),
    path('admin-panel/messages/', views.admin_messages, name='admin_messages'),
    # API
    path('api/services/', views.api_services),
    path('api/projects/', views.api_projects),
    path('api/future-projects/', views.api_future_projects),
    path('api/blog/', views.api_blog),
    path('api/company/', views.api_company),
]
