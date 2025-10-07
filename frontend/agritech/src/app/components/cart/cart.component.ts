import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, Cart, CartItem } from '../../services/cart.service';
import { SimpleAuthService } from '../../services/simple-auth.service';

@Component({
  selector: 'app-cart',
  template: `
    <div class="cart-container">
      <div class="cart-header">
        <h1>🛒 Shopping Cart</h1>
        <button (click)="goBack()" class="back-btn">← Back to Marketplace</button>
      </div>

      <div *ngIf="cart.items.length === 0" class="empty-cart">
        <div class="empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some fresh produce from our farmers!</p>
        <button (click)="goToMarketplace()" class="btn btn-primary">
          Browse Products
        </button>
      </div>

      <div *ngIf="cart.items.length > 0" class="cart-content">
        <div class="cart-items">
          <div *ngFor="let item of cart.items" class="cart-item">
            <div class="item-image">
              <img [src]="getProductImage(item.product)" [alt]="item.product.name" />
            </div>
            
            <div class="item-details">
              <h3>{{ item.product.name }}</h3>
              <p class="seller">👨‍🌾 {{ item.product.seller.full_name }}</p>
              <p class="unit-price">KSh {{ item.price }} per {{ item.product.unit }}</p>
              <div *ngIf="item.product.is_organic" class="organic-badge">Organic</div>
            </div>
            
            <div class="item-quantity">
              <label>Quantity:</label>
              <div class="quantity-controls">
                <button (click)="decreaseQuantity(item)" class="qty-btn">-</button>
                <input 
                  type="number" 
                  [value]="item.quantity" 
                  (change)="updateQuantity(item, $event)"
                  min="1"
                  class="qty-input">
                <button (click)="increaseQuantity(item)" class="qty-btn">+</button>
              </div>
              <p class="availability">{{ item.product.quantity_available }} {{ item.product.unit }} available</p>
            </div>
            
            <div class="item-total">
              <p class="total-price">KSh {{ item.total.toFixed(2) }}</p>
              <button (click)="removeItem(item.id)" class="remove-btn">
                🗑️ Remove
              </button>
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <div class="summary-card">
            <h3>Order Summary</h3>
            
            <div class="summary-row">
              <span>Items ({{ cart.totalItems }})</span>
              <span>KSh {{ cart.totalAmount.toFixed(2) }}</span>
            </div>
            
            <div class="summary-row">
              <span>Delivery Fee</span>
              <span>KSh 200.00</span>
            </div>
            
            <div class="summary-row total">
              <span><strong>Total</strong></span>
              <span><strong>KSh {{ (cart.totalAmount + 200).toFixed(2) }}</strong></span>
            </div>
            
            <div class="checkout-actions">
              <button 
                *ngIf="!authService.isLoggedIn()" 
                (click)="goToLogin()" 
                class="btn btn-primary btn-full">
                Login to Checkout
              </button>
              
              <button 
                *ngIf="authService.isLoggedIn()" 
                (click)="proceedToCheckout()" 
                class="btn btn-primary btn-full"
                [disabled]="loading">
                {{ loading ? 'Processing...' : 'Proceed to Checkout' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      min-height: 100vh;
      background: #f9fafb;
    }
    
    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e5e7eb;
    }
    
    .cart-header h1 {
      color: #1B5E20;
      font-size: 2rem;
      font-weight: 700;
    }
    
    .back-btn {
      background: transparent;
      border: 2px solid #1B5E20;
      color: #1B5E20;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .back-btn:hover {
      background: #1B5E20;
      color: white;
    }
    
    .empty-cart {
      text-align: center;
      padding: 4rem 2rem;
    }
    
    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }
    
    .empty-cart h2 {
      color: #374151;
      margin-bottom: 0.5rem;
    }
    
    .empty-cart p {
      color: #6b7280;
      margin-bottom: 2rem;
    }
    
    .cart-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }
    
    .cart-items {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .cart-item {
      display: grid;
      grid-template-columns: 100px 1fr auto auto;
      gap: 1rem;
      padding: 1.5rem 0;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .cart-item:last-child {
      border-bottom: none;
    }
    
    .item-image {
      width: 100px;
      height: 100px;
      border-radius: 0.5rem;
      overflow: hidden;
    }
    
    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .item-details h3 {
      color: #1f2937;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .seller {
      color: #6b7280;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }
    
    .unit-price {
      color: #1B5E20;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    
    .organic-badge {
      display: inline-block;
      background: #10b981;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    .item-quantity {
      text-align: center;
    }
    
    .item-quantity label {
      display: block;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: #374151;
    }
    
    .quantity-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    
    .qty-btn {
      width: 32px;
      height: 32px;
      border: 1px solid #d1d5db;
      background: white;
      border-radius: 0.25rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }
    
    .qty-btn:hover {
      background: #f3f4f6;
    }
    
    .qty-input {
      width: 60px;
      text-align: center;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
      padding: 0.25rem;
    }
    
    .availability {
      font-size: 0.75rem;
      color: #6b7280;
    }
    
    .item-total {
      text-align: right;
    }
    
    .total-price {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1B5E20;
      margin-bottom: 0.5rem;
    }
    
    .remove-btn {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
      padding: 0.5rem;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.875rem;
    }
    
    .remove-btn:hover {
      background: #fee2e2;
    }
    
    .summary-card {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 2rem;
    }
    
    .summary-card h3 {
      color: #1f2937;
      font-weight: 600;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }
    
    .summary-row.total {
      padding-top: 0.75rem;
      border-top: 1px solid #e5e7eb;
      font-size: 1.125rem;
    }
    
    .checkout-actions {
      margin-top: 1.5rem;
    }
    
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }
    
    .btn-primary {
      background: #1B5E20;
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: #2E7D32;
    }
    
    .btn-full {
      width: 100%;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    @media (max-width: 768px) {
      .cart-content {
        grid-template-columns: 1fr;
      }
      
      .cart-item {
        grid-template-columns: 80px 1fr;
        gap: 1rem;
      }
      
      .item-quantity, .item-total {
        grid-column: 1 / -1;
        text-align: left;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
      }
    }
  `]
})
export class CartComponent implements OnInit {
  cart: Cart = { items: [], totalItems: 0, totalAmount: 0 };
  loading = false;

  constructor(
    private cartService: CartService,
    public authService: SimpleAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  getProductImage(product: any): string {
    const categoryImages = {
      'Fruits': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop',
      'Vegetables': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
      'Grains': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
      'Dairy': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop',
      'Herbs': 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=300&fit=crop'
    };
    
    return categoryImages[product.category.name] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop';
  }

  updateQuantity(item: CartItem, event: any): void {
    const quantity = parseInt(event.target.value);
    if (quantity > 0) {
      this.cartService.updateQuantity(item.id, quantity);
    }
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.id, item.quantity - 1);
    }
  }

  removeItem(itemId: number): void {
    this.cartService.removeFromCart(itemId);
  }

  goBack(): void {
    window.history.back();
  }

  goToMarketplace(): void {
    this.router.navigate(['/marketplace']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  proceedToCheckout(): void {
    this.loading = true;
    
    // Simulate order creation
    setTimeout(() => {
      const orderData = {
        items: this.cart.items,
        total: this.cart.totalAmount + 200, // Including delivery fee
        delivery_fee: 200,
        buyer: this.authService.getCurrentUser()
      };
      
      // For now, just show success and clear cart
      alert(`Order placed successfully! Total: KSh ${orderData.total.toFixed(2)}\n\nOrder will be processed and you'll receive confirmation shortly.`);
      
      this.cartService.clearCart();
      this.loading = false;
      this.router.navigate(['/marketplace']);
    }, 2000);
  }
}
