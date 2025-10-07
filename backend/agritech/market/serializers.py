from rest_framework import serializers
from django.db import transaction
from .models import (
    Category, Product, ProductImage, Order, OrderItem, 
    Message, Review, Wishlist
)
from users.serializers import UserSerializer

class CategorySerializer(serializers.ModelSerializer):
    """Category serializer with hierarchical support"""
    
    children = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'parent', 'image', 'is_active', 'children', 'product_count']
    
    def get_children(self, obj):
        if obj.children.exists():
            return CategorySerializer(obj.children.filter(is_active=True), many=True).data
        return []
    
    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()

class ProductImageSerializer(serializers.ModelSerializer):
    """Product image serializer"""
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary']

class ProductListSerializer(serializers.ModelSerializer):
    """Serializer for product list view (minimal data)"""
    
    seller = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()
    average_rating = serializers.ReadOnlyField()
    total_reviews = serializers.ReadOnlyField()
    distance = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'unit', 'quantity_available', 'minimum_order',
            'is_organic', 'seller', 'category', 'primary_image', 'average_rating',
            'total_reviews', 'distance', 'created_at'
        ]
    
    def get_primary_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            return ProductImageSerializer(primary_image).data
        return None
    
    def get_distance(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.get_distance_from_user(request.user)
        return None

class ProductDetailSerializer(serializers.ModelSerializer):
    """Detailed product serializer"""
    
    seller = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    average_rating = serializers.ReadOnlyField()
    total_reviews = serializers.ReadOnlyField()
    distance = serializers.SerializerMethodField()
    is_in_wishlist = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'unit', 'quantity_available',
            'minimum_order', 'harvest_date', 'expiry_date', 'is_organic',
            'seller', 'category', 'images', 'average_rating', 'total_reviews',
            'distance', 'is_in_wishlist', 'views_count', 'created_at', 'updated_at'
        ]
    
    def get_distance(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.get_distance_from_user(request.user)
        return None
    
    def get_is_in_wishlist(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Wishlist.objects.filter(user=request.user, product=obj).exists()
        return False

class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating products"""
    
    images = ProductImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'category', 'price', 'unit',
            'quantity_available', 'minimum_order', 'harvest_date', 'expiry_date',
            'is_organic', 'images', 'uploaded_images'
        ]
    
    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        
        with transaction.atomic():
            product = Product.objects.create(**validated_data)
            
            # Handle image uploads
            for i, image in enumerate(uploaded_images):
                ProductImage.objects.create(
                    product=product,
                    image=image,
                    is_primary=(i == 0)  # First image is primary
                )
        
        return product
    
    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        
        with transaction.atomic():
            # Update product fields
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()
            
            # Handle new image uploads
            if uploaded_images:
                for i, image in enumerate(uploaded_images):
                    ProductImage.objects.create(
                        product=instance,
                        image=image,
                        is_primary=(i == 0 and not instance.images.filter(is_primary=True).exists())
                    )
        
        return instance

class OrderItemSerializer(serializers.ModelSerializer):
    """Order item serializer"""
    
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'quantity', 'unit_price', 'total_price']
        read_only_fields = ['total_price']

class OrderSerializer(serializers.ModelSerializer):
    """Order serializer"""
    
    buyer = UserSerializer(read_only=True)
    items = OrderItemSerializer(many=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'buyer', 'items', 'total_amount', 'status',
            'delivery_address', 'delivery_phone', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['order_number', 'total_amount']
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        with transaction.atomic():
            order = Order.objects.create(**validated_data)
            total_amount = 0
            
            for item_data in items_data:
                product = Product.objects.get(id=item_data['product_id'])
                item = OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=item_data['quantity'],
                    unit_price=product.price
                )
                total_amount += item.total_price
            
            order.total_amount = total_amount
            order.save()
        
        return order

class MessageSerializer(serializers.ModelSerializer):
    """Message serializer"""
    
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    receiver_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'receiver', 'receiver_id', 'order', 'subject',
            'body', 'is_read', 'sent_at'
        ]
        read_only_fields = ['sender', 'sent_at']

class ReviewSerializer(serializers.ModelSerializer):
    """Review serializer"""
    
    reviewer = UserSerializer(read_only=True)
    product = ProductListSerializer(read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'reviewer', 'product', 'rating', 'comment', 'created_at']
        read_only_fields = ['reviewer', 'created_at']

class WishlistSerializer(serializers.ModelSerializer):
    """Wishlist serializer"""
    
    product = ProductListSerializer(read_only=True)
    
    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'added_at']
        read_only_fields = ['added_at']
