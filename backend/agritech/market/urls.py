from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'orders', views.OrderViewSet, basename='order')
router.register(r'messages', views.MessageViewSet, basename='message')
router.register(r'reviews', views.ReviewViewSet, basename='review')
router.register(r'wishlist', views.WishlistViewSet, basename='wishlist')

urlpatterns = [
    path('', include(router.urls)),
    path('products/nearby/', views.nearby_products, name='nearby-products'),
    path('orders/<int:pk>/status/', views.update_order_status, name='update-order-status'),
    path('messages/threads/', views.message_threads, name='message-threads'),
    path('wishlist/toggle/<int:product_id>/', views.toggle_wishlist, name='toggle-wishlist'),
    path('analytics/', views.analytics_dashboard, name='analytics-dashboard'),
]
