import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<void>();

  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error = 'Please enter both email and password';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.loading = false;
        this.loginSuccess.emit();
        this.close.emit();
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Invalid email or password';
        console.error('Login error:', error);
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }

  // Quick login buttons for testing
  loginAsFarmer(): void {
    this.email = 'farmer1@agritech.com';
    this.password = 'farmer123';
    this.onSubmit();
  }

  loginAsBuyer(): void {
    this.email = 'buyer1@agritech.com';
    this.password = 'buyer123';
    this.onSubmit();
  }
}
