import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SimpleAuthService } from '../../services/simple-auth.service';
import { ProductService } from '../../services/product.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  loading = false;
  error = '';
  success = '';
  categories: any[] = [];
  
  productData = {
    name: '',
    description: '',
    category: '',
    price: '',
    unit: 'kg',
    quantity_available: '',
    minimum_order: '1',
    harvest_date: '',
    expiry_date: '',
    is_organic: false
  };
  
  unitOptions = [
    { value: 'kg', label: 'Kilogram' },
    { value: 'g', label: 'Gram' },
    { value: 'ton', label: 'Ton' },
    { value: 'bag', label: 'Bag' },
    { value: 'crate', label: 'Crate' },
    { value: 'piece', label: 'Piece' },
    { value: 'liter', label: 'Liter' },
    { value: 'bunch', label: 'Bunch' }
  ];

  constructor(
    private router: Router,
    private authService: SimpleAuthService,
    private productService: ProductService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Check if user is a farmer
    if (!this.authService.isFarmer()) {
      this.router.navigate(['/marketplace']);
      return;
    }
    
    this.loadCategories();
  }

  loadCategories(): void {
    // For now, use hardcoded categories. In production, fetch from API
    this.categories = [
      { id: 1, name: 'Fruits' },
      { id: 2, name: 'Vegetables' },
      { id: 3, name: 'Grains' },
      { id: 4, name: 'Dairy' },
      { id: 5, name: 'Herbs' }
    ];
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    // Prepare product data
    const productPayload = {
      name: this.productData.name,
      description: this.productData.description,
      category: parseInt(this.productData.category),
      price: parseFloat(this.productData.price),
      unit: this.productData.unit,
      quantity_available: parseInt(this.productData.quantity_available),
      minimum_order: parseInt(this.productData.minimum_order),
      harvest_date: this.productData.harvest_date || null,
      expiry_date: this.productData.expiry_date || null,
      is_organic: this.productData.is_organic
    };

    // Create product via API
    this.createProduct(productPayload);
  }

  private createProduct(productData: any): void {
    const token = this.authService.getToken();
    if (!token) {
      this.error = 'Authentication required. Please login again.';
      this.loading = false;
      return;
    }

    // Make HTTP request to create product
    fetch('http://localhost:8000/api/market/products/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      this.success = 'Product created successfully!';
      this.loading = false;
      
      // Reset form
      this.resetForm();
      
      // Redirect to farmer dashboard after 2 seconds
      setTimeout(() => {
        this.router.navigate(['/farmer-dashboard']);
      }, 2000);
    })
    .catch(error => {
      console.error('Error creating product:', error);
      this.error = 'Failed to create product. Please try again.';
      this.loading = false;
    });
  }

  private validateForm(): boolean {
    if (!this.productData.name.trim()) {
      this.error = 'Product name is required';
      return false;
    }
    
    if (!this.productData.description.trim()) {
      this.error = 'Product description is required';
      return false;
    }
    
    if (!this.productData.category) {
      this.error = 'Please select a category';
      return false;
    }
    
    if (!this.productData.price || parseFloat(this.productData.price) <= 0) {
      this.error = 'Please enter a valid price';
      return false;
    }
    
    if (!this.productData.quantity_available || parseInt(this.productData.quantity_available) <= 0) {
      this.error = 'Please enter available quantity';
      return false;
    }

    return true;
  }

  private resetForm(): void {
    this.productData = {
      name: '',
      description: '',
      category: '',
      price: '',
      unit: 'kg',
      quantity_available: '',
      minimum_order: '1',
      harvest_date: '',
      expiry_date: '',
      is_organic: false
    };
  }

  goBack(): void {
    this.router.navigate(['/farmer-dashboard']);
  }
}
