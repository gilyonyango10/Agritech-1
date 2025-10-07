import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, Product, ProductResponse } from './api.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private apiService: ApiService) { }

  getAllProducts(): Observable<Product[]> {
    return this.apiService.getAllProducts().pipe(
      map(response => response.results || [])
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.apiService.getProductById(id);
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.apiService.searchProducts(query).pipe(
      map(response => response.results || [])
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.apiService.getProductsByCategory(category).pipe(
      map(response => response.results || [])
    );
  }

  getNearbyProducts(latitude: number, longitude: number, radius: number = 50): Observable<Product[]> {
    return this.apiService.getNearbyProducts(latitude, longitude, radius).pipe(
      map(response => response.results || [])
    );
  }

  getFeaturedProducts(limit: number = 6): Observable<Product[]> {
    return this.getAllProducts().pipe(
      map(products => products.slice(0, limit))
    );
  }

  getRecentProducts(limit: number = 8): Observable<Product[]> {
    return this.getAllProducts().pipe(
      map(products => products
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit)
      )
    );
  }
}
