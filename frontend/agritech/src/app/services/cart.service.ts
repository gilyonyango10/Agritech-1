import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  product: any;
  quantity: number;
  price: number;
  total: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>({
    items: [],
    totalItems: 0,
    totalAmount: 0
  });

  public cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('agritech_cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      this.cartSubject.next(cart);
    }
  }

  private saveCartToStorage(cart: Cart): void {
    localStorage.setItem('agritech_cart', JSON.stringify(cart));
  }

  private calculateTotals(items: CartItem[]): Cart {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
    
    return {
      items,
      totalItems,
      totalAmount
    };
  }

  addToCart(product: any, quantity: number = 1): void {
    const currentCart = this.cartSubject.value;
    const existingItemIndex = currentCart.items.findIndex(item => item.product.id === product.id);

    let updatedItems: CartItem[];

    if (existingItemIndex >= 0) {
      // Update existing item
      updatedItems = [...currentCart.items];
      updatedItems[existingItemIndex].quantity += quantity;
      updatedItems[existingItemIndex].total = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].price;
    } else {
      // Add new item
      const newItem: CartItem = {
        id: Date.now(), // Simple ID generation
        product,
        quantity,
        price: parseFloat(product.price),
        total: quantity * parseFloat(product.price)
      };
      updatedItems = [...currentCart.items, newItem];
    }

    const updatedCart = this.calculateTotals(updatedItems);
    this.cartSubject.next(updatedCart);
    this.saveCartToStorage(updatedCart);
  }

  removeFromCart(itemId: number): void {
    const currentCart = this.cartSubject.value;
    const updatedItems = currentCart.items.filter(item => item.id !== itemId);
    const updatedCart = this.calculateTotals(updatedItems);
    
    this.cartSubject.next(updatedCart);
    this.saveCartToStorage(updatedCart);
  }

  updateQuantity(itemId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }

    const currentCart = this.cartSubject.value;
    const updatedItems = currentCart.items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity,
          total: quantity * item.price
        };
      }
      return item;
    });

    const updatedCart = this.calculateTotals(updatedItems);
    this.cartSubject.next(updatedCart);
    this.saveCartToStorage(updatedCart);
  }

  clearCart(): void {
    const emptyCart: Cart = {
      items: [],
      totalItems: 0,
      totalAmount: 0
    };
    
    this.cartSubject.next(emptyCart);
    this.saveCartToStorage(emptyCart);
  }

  getCart(): Cart {
    return this.cartSubject.value;
  }

  getCartItemCount(): number {
    return this.cartSubject.value.totalItems;
  }

  getCartTotal(): number {
    return this.cartSubject.value.totalAmount;
  }
}
