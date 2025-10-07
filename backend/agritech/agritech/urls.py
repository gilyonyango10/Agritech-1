from django.urls import path, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Swagger/OpenAPI Schema
schema_view = get_schema_view(
    openapi.Info(
        title="AgriTech Kenya API",
        default_version='v1',
        description="Agricultural Marketplace Management System API",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@agritech.co.ke"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

def api_root(request):
    return JsonResponse({
        'message': 'Welcome to AgriTech Kenya API',
        'version': '1.0',
        'endpoints': {
            'admin': '/admin/',
            'auth': '/auth/',
            'api': '/api/',
            'docs': '/swagger/',
            'redoc': '/redoc/',
        }
    })

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API Root
    path('', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/', api_root, name='api-root'),
    
    # Authentication
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    
    # API Documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # API endpoints
    path('api/users/', include('users.urls')),
    path('api/market/', include('market.urls')),
    path('api/blogs/', include('blogs.urls')),
    path('api/blog-categories/', include('blog_categories.urls')),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
