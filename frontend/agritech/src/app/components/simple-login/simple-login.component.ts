import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SimpleAuthService } from '../../services/simple-auth.service';

@Component({
  selector: 'app-simple-login',
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>🌾 AgriTech Kenya</h1>
          <p>Connect with farmers across Kenya</p>
        </div>
        
        <div class="auth-tabs">
          <button 
            class="tab-btn" 
            [class.active]="isLoginMode" 
            (click)="switchToLogin()">
            Login
          </button>
          <button 
            class="tab-btn" 
            [class.active]="!isLoginMode" 
            (click)="switchToSignup()">
            Sign Up
          </button>
        </div>
        
        <div *ngIf="error" class="error">{{ error }}</div>
        <div *ngIf="success" class="success">{{ success }}</div>
        
        <!-- Login Form -->
        <form *ngIf="isLoginMode" (ngSubmit)="onLogin()" class="auth-form">
          <div class="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              [(ngModel)]="email" 
              name="email"
              placeholder="Enter your email" 
              required>
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password"
              placeholder="Enter your password" 
              required>
          </div>
          
          <button type="submit" class="auth-btn" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
        
        <!-- Signup Form -->
        <form *ngIf="!isLoginMode" (ngSubmit)="onSignup()" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label>First Name</label>
              <input 
                type="text" 
                [(ngModel)]="signupData.first_name" 
                name="first_name"
                placeholder="First name" 
                required>
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input 
                type="text" 
                [(ngModel)]="signupData.last_name" 
                name="last_name"
                placeholder="Last name" 
                required>
            </div>
          </div>
          
          <div class="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              [(ngModel)]="signupData.email" 
              name="signup_email"
              placeholder="Enter your email" 
              required>
          </div>
          
          <div class="form-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              [(ngModel)]="signupData.phone_number" 
              name="phone"
              placeholder="+254 700 000 000" 
              required>
          </div>
          
          <div class="form-group">
            <label>I am a:</label>
            <select [(ngModel)]="signupData.role" name="role" required>
              <option value="">Select your role</option>
              <option value="farmer">Farmer - I want to sell my produce</option>
              <option value="buyer">Buyer - I want to buy fresh produce</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input 
              type="password" 
              [(ngModel)]="signupData.password" 
              name="signup_password"
              placeholder="Create a password" 
              required>
          </div>
          
          <button type="submit" class="auth-btn" [disabled]="loading">
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>
        
        <div class="auth-footer">
          <button (click)="goToMarketplace()" class="link-btn">
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%);
      padding: 2rem;
    }
    
    .auth-card {
      background: white;
      padding: 2.5rem;
      border-radius: 1rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 450px;
    }
    
    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .auth-header h1 {
      color: #1B5E20;
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    
    .auth-header p {
      color: #6b7280;
      font-size: 1rem;
    }
    
    .auth-tabs {
      display: flex;
      background: #f3f4f6;
      border-radius: 0.5rem;
      padding: 0.25rem;
      margin-bottom: 2rem;
    }
    
    .tab-btn {
      flex: 1;
      padding: 0.75rem;
      background: transparent;
      border: none;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      color: #6b7280;
    }
    
    .tab-btn.active {
      background: white;
      color: #1B5E20;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .auth-form {
      margin-bottom: 1.5rem;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }
    
    input, select {
      width: 100%;
      padding: 0.875rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 1rem;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    
    input:focus, select:focus {
      outline: none;
      border-color: #1B5E20;
      box-shadow: 0 0 0 3px rgba(27, 94, 32, 0.1);
    }
    
    select {
      cursor: pointer;
    }
    
    .auth-btn {
      width: 100%;
      padding: 1rem;
      background: #1B5E20;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .auth-btn:hover:not(:disabled) {
      background: #2E7D32;
    }
    
    .auth-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .error {
      background: #fef2f2;
      color: #dc2626;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
      border: 1px solid #fecaca;
      font-size: 0.875rem;
    }
    
    .success {
      background: #f0fdf4;
      color: #166534;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
      border: 1px solid #bbf7d0;
      font-size: 0.875rem;
    }
    
    .auth-footer {
      text-align: center;
      border-top: 1px solid #e5e7eb;
      padding-top: 1.5rem;
    }
    
    .link-btn {
      background: none;
      border: none;
      color: #1B5E20;
      font-weight: 500;
      cursor: pointer;
      text-decoration: underline;
      font-size: 0.875rem;
    }
    
    .link-btn:hover {
      color: #2E7D32;
    }
    
    @media (max-width: 640px) {
      .auth-container {
        padding: 1rem;
      }
      
      .auth-card {
        padding: 2rem;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SimpleLoginComponent implements OnInit {
  isLoginMode = true;
  email = '';
  password = '';
  loading = false;
  error = '';
  success = '';
  
  signupData = {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    role: '',
    password: ''
  };

  constructor(
    private authService: SimpleAuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if we should start in signup mode
    this.route.queryParams.subscribe(params => {
      if (params['mode'] === 'signup') {
        this.isLoginMode = false;
      }
    });
  }

  onLogin(): void {
    if (!this.email || !this.password) {
      this.error = 'Please enter email and password';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        // Redirect will be handled by router
        window.location.href = '/marketplace';
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Login failed. Please check your credentials.';
        console.error('Login error:', error);
      }
    });
  }

  switchToLogin(): void {
    this.isLoginMode = true;
    this.error = '';
    this.success = '';
  }

  switchToSignup(): void {
    this.isLoginMode = false;
    this.error = '';
    this.success = '';
  }

  onSignup(): void {
    if (!this.signupData.first_name || !this.signupData.last_name || 
        !this.signupData.email || !this.signupData.password || !this.signupData.role) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.error = '';

    // Create username from email
    const userData = {
      ...this.signupData,
      username: this.signupData.email.split('@')[0]
    };

    // For now, simulate successful signup and auto-login
    setTimeout(() => {
      this.success = 'Account created successfully! Logging you in...';
      this.loading = false;
      
      setTimeout(() => {
        this.email = this.signupData.email;
        this.password = this.signupData.password;
        this.onLogin();
      }, 1000);
    }, 1000);
  }

  goToMarketplace(): void {
    window.location.href = '/marketplace';
  }
}
