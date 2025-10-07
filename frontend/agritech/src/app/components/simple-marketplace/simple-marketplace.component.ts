import { Component, OnInit } from '@angular/core';
import { SimpleAuthService } from '../../services/simple-auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-simple-marketplace',
  template: `
    <div class="marketplace">
      <div class="hero">
        <h1>🌾 AgriTech Kenya Marketplace</h1>
        <p>Fresh produce directly from Kenyan farmers</p>
      </div>
      
      <div class="container">
        <div class="products-header">
          <h2>Available Products</h2>
          <div class="search-bar">
            <input 
              type="text" 
              [(ngModel)]="searchTerm" 
              (input)="filterProducts()"
              placeholder="Search products..."
              class="search-input">
          </div>
        </div>
        
        <div *ngIf="loading" class="loading">Loading products...</div>
        <div *ngIf="error" class="error">{{ error }}</div>
        
        <div class="products-grid" *ngIf="!loading && !error">
          <div *ngFor="let product of filteredProducts" class="product-card">
            <div class="product-image">
              <img [src]="getProductImage(product)" [alt]="product.name" />
              <div *ngIf="product.is_organic" class="organic-badge">Organic</div>
            </div>
            
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="description">{{ product.description }}</p>
              
              <div class="product-details">
                <div class="price">
                  <strong>KSh {{ product.price }}</strong> per {{ product.unit }}
                </div>
                <div class="availability">
                  {{ product.quantity_available }} {{ product.unit }} available
                </div>
                <div class="seller">
                  👨‍🌾 {{ product.seller.full_name }}
                </div>
                <div class="category">
                  📂 {{ product.category.name }}
                </div>
              </div>
              
              <div class="product-actions">
                <button 
                  *ngIf="authService.isLoggedIn()" 
                  class="btn btn-primary" 
                  (click)="addToCart(product)">
                  Add to Cart
                </button>
                <button 
                  *ngIf="!authService.isLoggedIn()" 
                  class="btn btn-outline" 
                  (click)="goToLogin()">
                  Login to Buy
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div *ngIf="filteredProducts.length === 0 && !loading" class="no-products">
          <p>No products found matching your search.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .marketplace {
      min-height: 100vh;
      background: #f9fafb;
    }
    
    .hero {
      background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%);
      color: white;
      text-align: center;
      padding: 4rem 2rem;
    }
    
    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }
    
    .hero p {
      font-size: 1.25rem;
      opacity: 0.9;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .products-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .products-header h2 {
      color: #1B5E20;
      font-size: 2rem;
    }
    
    .search-input {
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.375rem;
      font-size: 1rem;
      width: 300px;
    }
    
    .search-input:focus {
      outline: none;
      border-color: #1B5E20;
    }
    
    .loading, .error {
      text-align: center;
      padding: 2rem;
      font-size: 1.125rem;
    }
    
    .error {
      color: #dc2626;
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .product-card {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .product-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    
    .product-image {
      position: relative;
      height: 200px;
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .organic-badge {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: #10b981;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    .product-info {
      padding: 1.5rem;
    }
    
    .product-info h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }
    
    .description {
      color: #6b7280;
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .product-details {
      margin-bottom: 1rem;
    }
    
    .product-details > div {
      margin-bottom: 0.5rem;
    }
    
    .price {
      color: #1B5E20;
      font-size: 1.125rem;
    }
    
    .availability {
      color: #6b7280;
      font-size: 0.875rem;
    }
    
    .seller, .category {
      color: #4b5563;
      font-size: 0.875rem;
    }
    
    .btn {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .btn-primary {
      background: #1B5E20;
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: #2E7D32;
    }
    
    .btn-outline {
      background: transparent;
      color: #1B5E20;
      border: 2px solid #1B5E20;
    }
    
    .btn-outline:hover {
      background: #1B5E20;
      color: white;
    }
    
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .no-products {
      text-align: center;
      padding: 4rem 2rem;
      color: #6b7280;
    }
    
    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2rem;
      }
      
      .products-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
      
      .search-input {
        width: 100%;
      }
      
      .products-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SimpleMarketplaceComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  loading = true;
  error = '';
  searchTerm = '';

  constructor(
    public authService: SimpleAuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    fetch('http://localhost:8000/api/market/products/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load products');
        }
        return response.json();
      })
      .then(data => {
        this.products = data;
        this.filteredProducts = data;
        this.loading = false;
      })
      .catch(error => {
        console.error('Error loading products:', error);
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
      });
  }

  filterProducts(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = this.products;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.category.name.toLowerCase().includes(term) ||
      product.seller.full_name.toLowerCase().includes(term)
    );
  }

  getProductImage(product: any): string {
    // Return placeholder images based on category
    const categoryImages = {
      'Fruits': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop',
      'Vegetables': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
      'Grains': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
      'Dairy': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop',
      'Herbs': 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=300&fit=crop'
    };
    
    return categoryImages[product.category.name] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop';
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product, 1);
    
    // Show success message
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
      <div class="toast-content">
        <span>✅ ${product.name} added to cart!</span>
        <button onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    // Add toast styles
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 3000);
  }

  goToLogin(): void {
    window.location.href = '/login';
  }
}
