import django_filters
from django.db import models
from .models import Product, Category

class ProductFilter(django_filters.FilterSet):
    """Advanced filtering for products"""
    
    name = django_filters.CharFilter(lookup_expr='icontains')
    category = django_filters.ModelChoiceFilter(queryset=Category.objects.all())
    category_slug = django_filters.CharFilter(field_name='category__slug', lookup_expr='exact')
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    is_organic = django_filters.BooleanFilter()
    county = django_filters.CharFilter(field_name='seller__location__county', lookup_expr='icontains')
    sub_county = django_filters.CharFilter(field_name='seller__location__sub_county', lookup_expr='icontains')
    seller = django_filters.NumberFilter(field_name='seller__id')
    featured = django_filters.BooleanFilter()
    
    class Meta:
        model = Product
        fields = [
            'name', 'category', 'category_slug', 'min_price', 'max_price',
            'is_organic', 'county', 'sub_county', 'seller', 'featured'
        ]
