import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SimpleAuthService, SimpleUser } from '../../services/simple-auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-simple-header',
  template: `
    <header class="header">
      <div class="container">
        <div class="logo" (click)="goHome()">
          🌾 AgriTech Kenya
        </div>
        
        <nav class="nav">
          <a routerLink="/marketplace" routerLinkActive="active">Marketplace</a>
          <a *ngIf="currentUser && currentUser.role === 'farmer'" 
             routerLink="/farmer-dashboard" 
             routerLinkActive="active">Dashboard</a>
          <a *ngIf="currentUser && currentUser.role === 'farmer'" 
             routerLink="/add-product" 
             routerLinkActive="active">Add Product</a>
          <a routerLink="/cart" routerLinkActive="active" class="cart-link">
            🛒 Cart
            <span *ngIf="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
          </a>
        </nav>
        
        <div class="auth-section">
          <div *ngIf="!isLoggedIn" class="auth-buttons">
            <button (click)="goToLogin()" class="btn btn-outline">Login</button>
            <button (click)="goToSignup()" class="btn btn-primary">Sign Up</button>
          </div>
          
          <div *ngIf="isLoggedIn && currentUser" class="user-info">
            <span class="welcome">Welcome, {{ currentUser.full_name }}</span>
            <span class="role">({{ currentUser.role }})</span>
            <button (click)="logout()" class="btn btn-outline">Logout</button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%);
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      cursor: pointer;
    }
    
    .nav {
      display: flex;
      gap: 2rem;
    }
    
    .nav a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      transition: background 0.2s;
    }
    
    .nav a:hover, .nav a.active {
      background: rgba(255,255,255,0.2);
    }
    
    .cart-link {
      position: relative;
    }
    
    .cart-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #dc2626;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
    }
    
    .auth-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .auth-buttons {
      display: flex;
      gap: 0.5rem;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .welcome {
      font-weight: 500;
    }
    
    .role {
      font-size: 0.875rem;
      opacity: 0.8;
    }
    
    .btn {
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      border: none;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
    }
    
    .btn-outline {
      background: transparent;
      color: white;
      border: 1px solid white;
    }
    
    .btn-outline:hover {
      background: white;
      color: #1B5E20;
    }
    
    .btn-primary {
      background: white;
      color: #1B5E20;
      border: 1px solid white;
    }
    
    .btn-primary:hover {
      background: #f3f4f6;
      color: #1B5E20;
    }
    
    @media (max-width: 768px) {
      .container {
        flex-direction: column;
        gap: 1rem;
      }
      
      .nav {
        gap: 1rem;
      }
    }
  `]
})
export class SimpleHeaderComponent implements OnInit {
  currentUser: SimpleUser | null = null;
  isLoggedIn = false;
  cartItemCount = 0;

  constructor(
    private authService: SimpleAuthService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
    
    this.cartService.cart$.subscribe(cart => {
      this.cartItemCount = cart.totalItems;
    });
  }

  goHome(): void {
    this.router.navigate(['/marketplace']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToSignup(): void {
    // Navigate to login page but switch to signup mode
    this.router.navigate(['/login'], { queryParams: { mode: 'signup' } });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/marketplace']);
  }
}
