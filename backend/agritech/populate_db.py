#!/usr/bin/env python
import os
import sys
import django
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agritech.settings')
django.setup()

from users.models import User
from market.models import Category, Product
from decimal import Decimal

def create_sample_data():
    print("Creating sample data...")
    
    # Create categories
    categories_data = [
        {'name': 'Fruits', 'slug': 'fruits', 'description': 'Fresh fruits from local farms'},
        {'name': 'Vegetables', 'slug': 'vegetables', 'description': 'Fresh vegetables and greens'},
        {'name': 'Grains', 'slug': 'grains', 'description': 'Cereals and grains'},
        {'name': 'Dairy', 'slug': 'dairy', 'description': 'Fresh dairy products'},
        {'name': 'Herbs', 'slug': 'herbs', 'description': 'Fresh herbs and spices'},
    ]
    
    categories = {}
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            slug=cat_data['slug'],
            defaults=cat_data
        )
        categories[cat_data['slug']] = category
        if created:
            print(f"Created category: {category.name}")
    
    # Create sample farmers
    farmers_data = [
        {
            'email': 'farmer1@agritech.com',
            'username': 'farmer1',
            'first_name': 'John',
            'last_name': 'Kamau',
            'role': 'farmer',
            'phone_number': '+254712345678',
            'password': 'farmer123'
        },
        {
            'email': 'farmer2@agritech.com',
            'username': 'farmer2',
            'first_name': 'Mary',
            'last_name': 'Wanjiku',
            'role': 'farmer',
            'phone_number': '+254723456789',
            'password': 'farmer123'
        },
        {
            'email': 'farmer3@agritech.com',
            'username': 'farmer3',
            'first_name': 'Peter',
            'last_name': 'Mwangi',
            'role': 'farmer',
            'phone_number': '+254734567890',
            'password': 'farmer123'
        }
    ]
    
    farmers = []
    for farmer_data in farmers_data:
        try:
            farmer = User.objects.get(email=farmer_data['email'])
            print(f"Farmer {farmer.email} already exists")
        except User.DoesNotExist:
            password = farmer_data.pop('password')
            farmer = User.objects.create_user(**farmer_data)
            farmer.set_password(password)
            farmer.save()
            print(f"Created farmer: {farmer.full_name}")
        farmers.append(farmer)
    
    # Create sample buyers
    buyers_data = [
        {
            'email': 'buyer1@agritech.com',
            'username': 'buyer1',
            'first_name': 'Sarah',
            'last_name': 'Njeri',
            'role': 'buyer',
            'phone_number': '+254745678901',
            'password': 'buyer123'
        },
        {
            'email': 'buyer2@agritech.com',
            'username': 'buyer2',
            'first_name': 'David',
            'last_name': 'Ochieng',
            'role': 'buyer',
            'phone_number': '+254756789012',
            'password': 'buyer123'
        }
    ]
    
    for buyer_data in buyers_data:
        try:
            buyer = User.objects.get(email=buyer_data['email'])
            print(f"Buyer {buyer.email} already exists")
        except User.DoesNotExist:
            password = buyer_data.pop('password')
            buyer = User.objects.create_user(**buyer_data)
            buyer.set_password(password)
            buyer.save()
            print(f"Created buyer: {buyer.full_name}")
    
    # Create sample products
    products_data = [
        {
            'name': 'Fresh Tomatoes',
            'description': 'Organic red tomatoes, freshly harvested from our farm in Kiambu. Perfect for cooking and salads.',
            'category': 'vegetables',
            'price': Decimal('120.00'),
            'unit': 'kg',
            'quantity_available': 500,
            'minimum_order': 5,
            'is_organic': True,
            'seller_index': 0
        },
        {
            'name': 'Sweet Bananas',
            'description': 'Sweet and ripe bananas from Meru. Rich in potassium and perfect for snacks.',
            'category': 'fruits',
            'price': Decimal('80.00'),
            'unit': 'bunch',
            'quantity_available': 200,
            'minimum_order': 2,
            'is_organic': False,
            'seller_index': 1
        },
        {
            'name': 'White Maize',
            'description': 'High quality white maize, dried and ready for milling. Grown in Nakuru county.',
            'category': 'grains',
            'price': Decimal('45.00'),
            'unit': 'kg',
            'quantity_available': 1000,
            'minimum_order': 50,
            'is_organic': False,
            'seller_index': 2
        },
        {
            'name': 'Fresh Spinach',
            'description': 'Organic spinach leaves, perfect for healthy meals. Grown without pesticides.',
            'category': 'vegetables',
            'price': Decimal('60.00'),
            'unit': 'bunch',
            'quantity_available': 150,
            'minimum_order': 3,
            'is_organic': True,
            'seller_index': 0
        },
        {
            'name': 'Avocados',
            'description': 'Premium Hass avocados from Murang\'a. Creamy and nutritious.',
            'category': 'fruits',
            'price': Decimal('15.00'),
            'unit': 'piece',
            'quantity_available': 800,
            'minimum_order': 10,
            'is_organic': True,
            'seller_index': 1
        },
        {
            'name': 'Fresh Milk',
            'description': 'Fresh cow milk from free-range cattle. Delivered daily.',
            'category': 'dairy',
            'price': Decimal('55.00'),
            'unit': 'liter',
            'quantity_available': 100,
            'minimum_order': 2,
            'is_organic': True,
            'seller_index': 2
        },
        {
            'name': 'Coriander',
            'description': 'Fresh coriander leaves for cooking and garnishing.',
            'category': 'herbs',
            'price': Decimal('30.00'),
            'unit': 'bunch',
            'quantity_available': 80,
            'minimum_order': 2,
            'is_organic': True,
            'seller_index': 0
        },
        {
            'name': 'Irish Potatoes',
            'description': 'Fresh Irish potatoes from Nyandarua. Perfect for cooking.',
            'category': 'vegetables',
            'price': Decimal('70.00'),
            'unit': 'kg',
            'quantity_available': 600,
            'minimum_order': 10,
            'is_organic': False,
            'seller_index': 1
        }
    ]
    
    for product_data in products_data:
        category_slug = product_data.pop('category')
        seller_index = product_data.pop('seller_index')
        
        product_data['category'] = categories[category_slug]
        product_data['seller'] = farmers[seller_index]
        
        try:
            product = Product.objects.get(
                name=product_data['name'],
                seller=product_data['seller']
            )
            print(f"Product {product.name} already exists")
        except Product.DoesNotExist:
            product = Product.objects.create(**product_data)
            print(f"Created product: {product.name} by {product.seller.full_name}")
    
    print("\nSample data creation completed!")
    print("\nTest accounts:")
    print("Admin: admin@agritech.com / admin123")
    print("Farmers: farmer1@agritech.com / farmer123, farmer2@agritech.com / farmer123, farmer3@agritech.com / farmer123")
    print("Buyers: buyer1@agritech.com / buyer123, buyer2@agritech.com / buyer123")

if __name__ == '__main__':
    create_sample_data()
