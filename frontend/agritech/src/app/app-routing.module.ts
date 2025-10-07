import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimpleLoginComponent } from './components/simple-login/simple-login.component';
import { SimpleMarketplaceComponent } from './components/simple-marketplace/simple-marketplace.component';
import { CartComponent } from './components/cart/cart.component';
import { FarmerDashboardComponent } from './components/farmer-dashboard/farmer-dashboard.component';
import { AddProductComponent } from './components/add-product/add-product.component';

const routes: Routes = [
  { path: '', redirectTo: '/marketplace', pathMatch: 'full' },
  { path: 'login', component: SimpleLoginComponent },
  { path: 'marketplace', component: SimpleMarketplaceComponent },
  { path: 'cart', component: CartComponent },
  { path: 'farmer-dashboard', component: FarmerDashboardComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: '**', redirectTo: '/marketplace' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
