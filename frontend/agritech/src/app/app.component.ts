import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { BlogService } from './services/blog.service';
import { Blog, User } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AgriTech Kenya';
  showLoginModal = false;
  currentUser: User | null = null;
  isLoggedIn = false;
  recentBlogs: Blog[] = [];
  loading = false;
  error = '';
  isRouterOutletActive = false;
  
  // Modal states
  showRegisterModal = false;
  
  // Form data
  loginData = {
    email: '',
    password: ''
  };
  
  registerData = {
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    role: '',
    phone_number: '',
    password: ''
  };

  constructor(
    private router: Router,
    public authService: AuthService,
    private blogService: BlogService
  ) {
    // Listen to router events to show/hide homepage content
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isRouterOutletActive = event.url !== '/' && event.url !== '/marketplace';
    });
  }

  ngOnInit(): void {
    // Subscribe to authentication state
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });

    // Load recent blogs
    this.loadRecentBlogs();
  }

  loadRecentBlogs(): void {
    this.loading = true;
    this.blogService.getRecentBlogs(3).subscribe({
      next: (blogs) => {
        this.recentBlogs = blogs;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading blogs:', error);
        this.error = 'Failed to load blogs';
        this.loading = false;
      }
    });
  }

  onLogin(): void {
    if (!this.loginData.email || !this.loginData.password) {
      alert('Please fill in all fields');
      return;
    }

    this.loading = true;
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.showLoginModal = false;
        this.resetLoginForm();
        this.loading = false;
        // Show success message
        alert(`Welcome back, ${response.user.full_name || response.user.username}!`);
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials.');
        this.loading = false;
      }
    });
  }

  onRegister(): void {
    if (!this.registerData.email || !this.registerData.password || !this.registerData.username || 
        !this.registerData.first_name || !this.registerData.last_name || !this.registerData.role) {
      alert('Please fill in all required fields');
      return;
    }

    this.loading = true;
    this.authService.register(this.registerData).subscribe({
      next: (user) => {
        console.log('Registration successful:', user);
        this.showRegisterModal = false;
        this.resetRegisterForm();
        this.loading = false;
        alert(`Welcome to AgriTech Kenya, ${user.full_name || user.username}!`);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
        this.loading = false;
      }
    });
  }

  closeModals(): void {
    this.showLoginModal = false;
    this.showRegisterModal = false;
    this.resetForms();
  }

  resetForms(): void {
    this.resetLoginForm();
    this.resetRegisterForm();
  }

  resetLoginForm(): void {
    this.loginData = {
      email: '',
      password: ''
    };
  }

  resetRegisterForm(): void {
    this.registerData = {
      email: '',
      username: '',
      first_name: '',
      last_name: '',
      role: '',
      phone_number: '',
      password: ''
    };
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/marketplace']);
  }

  getUserDisplayName(): string {
    return this.currentUser?.full_name || this.currentUser?.username || 'User';
  }

  getUserRole(): string {
    return this.currentUser?.role || '';
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
  }

  onLoginSuccess(): void {
    this.showLoginModal = false;
    // Refresh user state
    this.ngOnInit();
  }
}
