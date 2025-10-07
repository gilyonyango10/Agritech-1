import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../services/api.service';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  selectedCategory = '';
  categories = ['Fruits', 'Vegetables', 'Grains', 'Dairy', 'Meat', 'Herbs'];
  
  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.filterProducts();
  }

  onCategoryChange(): void {
    this.filterProducts();
  }

  private filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchTerm || 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesCategory = !this.selectedCategory || 
        product.category.name === this.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }

  addToCart(product: Product): void {
    // TODO: Implement cart functionality
    console.log('Added to cart:', product);
    alert(`${product.name} added to cart!`);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
