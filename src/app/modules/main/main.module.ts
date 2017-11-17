import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Components
 */
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MainComponent } from './main.component';

/**
 * Modules
 */
import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from './../shared/shared.module';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { ProductComponent } from './components/product/product.component';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent, 
    MainComponent, UserRegisterComponent, ProductComponent
  ]
})
export class MainModule { }
