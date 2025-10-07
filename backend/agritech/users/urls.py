from django.urls import path
from . import views

urlpatterns = [
    path('', views.UserListView.as_view(), name='user-list'),
    path('register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('login/', views.user_login, name='user-login'),
    path('profile/', views.current_user_profile, name='current-user-profile'),
    path('<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
]