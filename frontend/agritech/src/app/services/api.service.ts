import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  phone_number: string;
  is_verified: boolean;
  bio: string;
  created_at: string;
  updated_at: string;
}

export interface Blog {
  categories: number[];
  slug: string;
  blog_image: string | null;
  title: string;
  blog_author: string;
  first_paragraph: string;
  middle_paragragh: string | null;
  final_paragragh: string | null;
  country: string;
  reading_time: string;
  blog_date: string;
  updated_at: string;
  is_published: boolean;
}

export interface BlogResponse {
  message: string;
  blogs: Blog[];
  error: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  phone_number: string;
  password: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  category: any;
  price: number;
  unit: string;
  quantity_available: number;
  minimum_order: number;
  image?: string;
  seller: User;
  is_organic: boolean;
  harvest_date?: string;
  expiry_date?: string;
  created_at: string;
  updated_at?: string;
  average_rating: number;
  total_reviews: number;
  distance?: number;
  primary_image?: any;
}

export interface ProductResponse {
  count?: number;
  next?: string;
  previous?: string;
  results: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8000/api';
  
  private getHttpOptions() {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
    return { headers };
  }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // User Authentication APIs
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`http://localhost:8000/auth/jwt/create/`, credentials, this.httpOptions);
  }

  register(userData: RegisterRequest): Observable<User> {
    return this.http.post<User>(`http://localhost:8000/auth/users/`, userData, this.httpOptions);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`http://localhost:8000/auth/users/me/`, this.getHttpOptions());
  }

  // Blog APIs
  getAllBlogs(): Observable<BlogResponse> {
    return this.http.get<BlogResponse>(`${this.baseUrl}/blogs/`);
  }

  getBlogBySlug(slug: string): Observable<BlogResponse> {
    return this.http.get<BlogResponse>(`${this.baseUrl}/blogs/${slug}/`);
  }

  searchBlogs(title: string): Observable<BlogResponse> {
    return this.http.get<BlogResponse>(`${this.baseUrl}/blogs/search/${title}`);
  }

  getPublishedBlogs(): Observable<BlogResponse> {
    return this.http.get<BlogResponse>(`${this.baseUrl}/blogs/published`);
  }

  // Users APIs
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`http://localhost:8000/auth/users/`, this.getHttpOptions());
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`http://localhost:8000/auth/users/${id}/`, this.getHttpOptions());
  }

  // Product APIs
  getAllProducts(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.baseUrl}/market/products/`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/market/products/${id}/`);
  }

  searchProducts(query: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.baseUrl}/market/products/search/?q=${query}`);
  }

  getProductsByCategory(category: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.baseUrl}/market/products/category/${category}/`);
  }

  getNearbyProducts(latitude: number, longitude: number, radius: number = 50): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.baseUrl}/market/products/nearby/?lat=${latitude}&lng=${longitude}&radius=${radius}`);
  }
}
