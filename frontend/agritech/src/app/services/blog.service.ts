import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, Blog, BlogResponse } from './api.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private apiService: ApiService) { }

  getAllBlogs(): Observable<Blog[]> {
    return this.apiService.getAllBlogs().pipe(
      map(response => response.blogs)
    );
  }

  getPublishedBlogs(): Observable<Blog[]> {
    return this.apiService.getPublishedBlogs().pipe(
      map(response => response.blogs)
    );
  }

  getBlogBySlug(slug: string): Observable<Blog | null> {
    return this.apiService.getBlogBySlug(slug).pipe(
      map(response => response.blogs.length > 0 ? response.blogs[0] : null)
    );
  }

  searchBlogs(searchTerm: string): Observable<Blog[]> {
    return this.apiService.searchBlogs(searchTerm).pipe(
      map(response => response.blogs)
    );
  }

  getFeaturedBlogs(): Observable<Blog[]> {
    // Return first 3 published blogs as featured
    return this.getPublishedBlogs().pipe(
      map(blogs => blogs.slice(0, 3))
    );
  }

  getRecentBlogs(limit: number = 5): Observable<Blog[]> {
    return this.getPublishedBlogs().pipe(
      map(blogs => blogs.slice(0, limit))
    );
  }
}
