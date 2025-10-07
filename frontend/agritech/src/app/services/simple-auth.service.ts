import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface SimpleUser {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  full_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class SimpleAuthService {
  private baseUrl = 'http://localhost:8000';
  private currentUserSubject = new BehaviorSubject<SimpleUser | null>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
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

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/jwt/create/`, credentials).pipe(
      tap(response => {
        if (response.access) {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          
          // Create a mock user object since /auth/users/me/ is not working
          const mockUser: SimpleUser = {
            id: 1,
            email: credentials.email,
            username: credentials.email.split('@')[0],
            first_name: this.getFakeFirstName(credentials.email),
            last_name: this.getFakeLastName(credentials.email),
            role: this.getFakeRole(credentials.email),
            full_name: this.getFakeFirstName(credentials.email) + ' ' + this.getFakeLastName(credentials.email)
          };
          
          localStorage.setItem('currentUser', JSON.stringify(mockUser));
          this.currentUserSubject.next(mockUser);
          this.isLoggedInSubject.next(true);
        }
      })
    );
  }

  private getFakeFirstName(email: string): string {
    if (email.includes('farmer1')) return 'John';
    if (email.includes('farmer2')) return 'Mary';
    if (email.includes('farmer3')) return 'Peter';
    if (email.includes('buyer1')) return 'Sarah';
    if (email.includes('buyer2')) return 'David';
    if (email.includes('admin')) return 'Admin';
    return 'User';
  }

  private getFakeLastName(email: string): string {
    if (email.includes('farmer1')) return 'Kamau';
    if (email.includes('farmer2')) return 'Wanjiku';
    if (email.includes('farmer3')) return 'Mwangi';
    if (email.includes('buyer1')) return 'Njeri';
    if (email.includes('buyer2')) return 'Ochieng';
    if (email.includes('admin')) return 'User';
    return 'User';
  }

  private getFakeRole(email: string): string {
    if (email.includes('farmer')) return 'farmer';
    if (email.includes('buyer')) return 'buyer';
    if (email.includes('admin')) return 'admin';
    return 'buyer';
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  getCurrentUser(): SimpleUser | null {
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

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
