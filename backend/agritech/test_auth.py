#!/usr/bin/env python
import os
import sys
import django
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agritech.settings')
django.setup()

from users.models import User
from rest_framework_simplejwt.tokens import RefreshToken
import requests

def test_authentication():
    # Get a farmer user
    farmer = User.objects.get(email='farmer1@agritech.com')
    print(f"Testing with user: {farmer.email} (Role: {farmer.role})")
    
    # Generate token
    refresh = RefreshToken.for_user(farmer)
    access_token = str(refresh.access_token)
    print(f"Generated access token: {access_token[:50]}...")
    
    # Test authentication with the token
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    
    # Test getting current user
    print("\n1. Testing /auth/users/me/")
    response = requests.get('http://localhost:8000/auth/users/me/', headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text[:200]}")
    
    # Test creating a product
    print("\n2. Testing product creation")
    product_data = {
        "name": "Test Carrots",
        "description": "Test organic carrots",
        "category": 2,
        "price": "90.00",
        "unit": "kg",
        "quantity_available": 200,
        "minimum_order": 5,
        "is_organic": True
    }
    
    response = requests.post('http://localhost:8000/api/market/products/', 
                           json=product_data, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    # Test getting products
    print("\n3. Testing product list")
    response = requests.get('http://localhost:8000/api/market/products/')
    print(f"Status: {response.status_code}")
    print(f"Products count: {len(response.json()) if response.status_code == 200 else 'Error'}")

if __name__ == '__main__':
    test_authentication()
