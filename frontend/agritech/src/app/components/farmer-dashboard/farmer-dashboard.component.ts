import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SimpleAuthService, SimpleUser } from '../../services/simple-auth.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../services/api.service';

@Component({
  selector: 'app-farmer-dashboard',
  templateUrl: './farmer-dashboard.component.html',
  styleUrls: ['./farmer-dashboard.component.css']
})
export class FarmerDashboardComponent implements OnInit {
  currentUser: SimpleUser | null = null;
  myProducts: Product[] = [];
  loading = false;
  error = '';
  
  // Stats
  totalProducts = 0;
  totalRevenue = 0;
  activeOrders = 0;

  constructor(
    private router: Router,
    public authService: SimpleAuthService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser && this.authService.isFarmer()) {
      this.loadFarmerData();
    }
  }

  loadFarmerData(): void {
    this.loading = true;
    // For now, we'll load all products and filter by farmer
    // In a real app, we'd have a specific endpoint for farmer's products
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        if (this.currentUser) {
          this.myProducts = products.filter(p => p.seller.id === this.currentUser.id);
          this.calculateStats();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading farmer data:', error);
        this.error = 'Failed to load your products';
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    this.totalProducts = this.myProducts.length;
    this.totalRevenue = this.myProducts.reduce((sum, product) => {
      return sum + (product.price * (100 - product.quantity_available)); // Assuming sold quantity
    }, 0);
    this.activeOrders = Math.floor(Math.random() * 10) + 1; // Mock data
  }

  addNewProduct(): void {
    this.router.navigate(['/add-product']);
  }

  editProduct(product: Product): void {
    // TODO: Implement edit product functionality
    alert(`Edit ${product.name} functionality coming soon!`);
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      // TODO: Implement delete product functionality
      alert(`Delete ${product.name} functionality coming soon!`);
    }
  }

  viewOrders(): void {
    // TODO: Implement view orders functionality
    alert('View Orders functionality coming soon!');
  }
}
