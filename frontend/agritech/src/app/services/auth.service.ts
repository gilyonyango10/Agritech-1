import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService, User, LoginRequest, RegisterRequest } from './api.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private apiService: ApiService) {
    // Check if user is already logged in
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem('currentUser');
    const token = localStorage.getItem('access_token');
    if (userData && token) {
      const user = JSON.parse(userData);
      this.currentUserSubject.next(user);
      this.isLoggedInSubject.next(true);
    }
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.apiService.login(credentials).pipe(
      tap(response => {
        if (response.access) {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          
          // Get user profile after successful login with a small delay
          setTimeout(() => {
            this.apiService.getCurrentUser().subscribe({
              next: (user) => {
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                this.isLoggedInSubject.next(true);
              },
              error: (error) => {
                console.error('Error fetching user profile:', error);
                // Still mark as logged in since we have a valid token
                this.isLoggedInSubject.next(true);
              }
            });
          }, 100);
        }
      })
    );
  }

  register(userData: RegisterRequest): Observable<User> {
    return this.apiService.register(userData).pipe(
      tap(user => {
        // After registration, automatically log in the user
        this.login({ email: userData.email, password: userData.password }).subscribe();
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  isFarmer(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'farmer';
  }

  isBuyer(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'buyer';
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
}
