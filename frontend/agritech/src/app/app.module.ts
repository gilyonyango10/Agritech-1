import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { SimpleAppComponent } from './simple-app.component';
import { SimpleHeaderComponent } from './components/simple-header/simple-header.component';
import { SimpleLoginComponent } from './components/simple-login/simple-login.component';
import { SimpleMarketplaceComponent } from './components/simple-marketplace/simple-marketplace.component';
import { CartComponent } from './components/cart/cart.component';
import { FarmerDashboardComponent } from './components/farmer-dashboard/farmer-dashboard.component';
import { AddProductComponent } from './components/add-product/add-product.component';

@NgModule({
  declarations: [
    SimpleAppComponent,
    SimpleHeaderComponent,
    SimpleLoginComponent,
    SimpleMarketplaceComponent,
    CartComponent,
    FarmerDashboardComponent,
    AddProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [SimpleAppComponent]
})
export class AppModule { }
