from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.authentication import JWTAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg, Count, Sum
from django.shortcuts import get_object_or_404
from django.db import models

from .models import (
    Category, Product, ProductImage, Order, OrderItem,
    Message, Review, Wishlist
)
from .serializers import (
    CategorySerializer, ProductListSerializer, ProductDetailSerializer,
    ProductCreateUpdateSerializer, OrderSerializer, MessageSerializer,
    ReviewSerializer, WishlistSerializer
)
from .filters import ProductFilter
from .permissions import IsOwnerOrReadOnly, IsSellerOrReadOnly

class CategoryViewSet(ModelViewSet):
    """Category CRUD operations"""
    
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    
    def get_queryset(self):
        # Only return top-level categories by default
        if self.action == 'list':
            return self.queryset.filter(parent=None)
        return self.queryset

class ProductViewSet(ModelViewSet):
    """Product CRUD operations with advanced filtering"""
    
    queryset = Product.objects.filter(is_active=True).select_related(
        'seller', 'category'
    ).prefetch_related('images', 'reviews')
    
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly, IsSellerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'category__name']
    ordering_fields = ['price', 'created_at', 'views_count']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ProductCreateUpdateSerializer
        return ProductDetailSerializer
    
    def get_queryset(self):
        queryset = self.queryset
        
        # Filter by location if coordinates provided
        lat = self.request.query_params.get('lat')
        lng = self.request.query_params.get('lng')
        radius = self.request.query_params.get('radius', 50)  # Default 50km
        
        if lat and lng:
            # This is a simplified distance filter
            # In production, you'd use PostGIS or similar for accurate geo queries
            queryset = queryset.filter(
                seller__location__latitude__isnull=False,
                seller__location__longitude__isnull=False
            )
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        return super().retrieve(request, *args, **kwargs)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def nearby_products(request):
    """Get products near user's location"""
    
    user = request.user
    if not hasattr(user, 'location') or not user.location.latitude:
        return Response(
            {'error': 'User location not set'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Get radius from query params (default 25km)
    radius = float(request.GET.get('radius', 25))
    
    # Simple distance calculation (in production, use PostGIS)
    products = Product.objects.filter(
        is_active=True,
        seller__location__latitude__isnull=False,
        seller__location__longitude__isnull=False
    ).select_related('seller', 'category').prefetch_related('images')
    
    # Filter products by distance (simplified)
    nearby_products = []
    for product in products:
        distance = product.get_distance_from_user(user)
        if distance and distance <= radius:
            nearby_products.append(product)
    
    # Sort by distance
    nearby_products.sort(key=lambda p: p.get_distance_from_user(user))
    
    serializer = ProductListSerializer(nearby_products, many=True, context={'request': request})
    return Response(serializer.data)

class OrderViewSet(ModelViewSet):
    """Order management"""
    
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'farmer':
            # Farmers see orders for their products
            return Order.objects.filter(
                items__product__seller=user
            ).distinct().select_related('buyer').prefetch_related('items__product')
        else:
            # Buyers see their own orders
            return Order.objects.filter(buyer=user).select_related('buyer').prefetch_related('items__product')
    
    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_order_status(request, pk):
    """Update order status (for sellers)"""
    
    order = get_object_or_404(Order, pk=pk)
    
    # Check if user is the seller of any item in the order
    if not order.items.filter(product__seller=request.user).exists():
        return Response(
            {'error': 'Permission denied'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    new_status = request.data.get('status')
    if new_status not in dict(Order.STATUS_CHOICES):
        return Response(
            {'error': 'Invalid status'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    order.status = new_status
    order.save()
    
    serializer = OrderSerializer(order, context={'request': request})
    return Response(serializer.data)

class MessageViewSet(ModelViewSet):
    """Messaging between users"""
    
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).select_related('sender', 'receiver', 'order')
    
    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def message_threads(request):
    """Get message threads for current user"""
    
    user = request.user
    
    # Get unique conversation partners
    sent_to = Message.objects.filter(sender=user).values_list('receiver', flat=True).distinct()
    received_from = Message.objects.filter(receiver=user).values_list('sender', flat=True).distinct()
    
    partner_ids = set(list(sent_to) + list(received_from))
    
    threads = []
    for partner_id in partner_ids:
        # Get latest message in thread
        latest_message = Message.objects.filter(
            Q(sender=user, receiver_id=partner_id) | 
            Q(sender_id=partner_id, receiver=user)
        ).order_by('-sent_at').first()
        
        # Count unread messages
        unread_count = Message.objects.filter(
            sender_id=partner_id, receiver=user, is_read=False
        ).count()
        
        if latest_message:
            thread_data = MessageSerializer(latest_message, context={'request': request}).data
            thread_data['unread_count'] = unread_count
            threads.append(thread_data)
    
    # Sort by latest message
    threads.sort(key=lambda x: x['sent_at'], reverse=True)
    
    return Response(threads)

class ReviewViewSet(ModelViewSet):
    """Product reviews"""
    
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        product_id = self.request.query_params.get('product')
        if product_id:
            return Review.objects.filter(product_id=product_id).select_related('reviewer', 'product')
        return Review.objects.all().select_related('reviewer', 'product')
    
    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)

class WishlistViewSet(ModelViewSet):
    """User wishlist management"""
    
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).select_related('product')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_wishlist(request, product_id):
    """Add or remove product from wishlist"""
    
    product = get_object_or_404(Product, id=product_id, is_active=True)
    wishlist_item, created = Wishlist.objects.get_or_create(
        user=request.user, 
        product=product
    )
    
    if not created:
        wishlist_item.delete()
        return Response({'message': 'Removed from wishlist', 'in_wishlist': False})
    
    return Response({'message': 'Added to wishlist', 'in_wishlist': True})

@api_view(['GET'])
def analytics_dashboard(request):
    """Analytics data for admin dashboard"""
    
    if not request.user.is_staff and request.user.role != 'admin':
        return Response(
            {'error': 'Permission denied'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Basic analytics
    from users.models import User
    
    analytics = {
        'total_users': User.objects.count(),
        'farmers': User.objects.filter(role='farmer').count(),
        'buyers': User.objects.filter(role='buyer').count(),
        'total_products': Product.objects.filter(is_active=True).count(),
        'total_orders': Order.objects.count(),
        'total_revenue': Order.objects.filter(status='delivered').aggregate(
            total=Sum('total_amount')
        )['total'] or 0,
        'categories': Category.objects.annotate(
            product_count=Count('products')
        ).values('name', 'product_count'),
        'top_products': Product.objects.annotate(
            order_count=Count('orderitem')
        ).order_by('-order_count')[:10].values('name', 'order_count'),
    }
    
    return Response(analytics)
