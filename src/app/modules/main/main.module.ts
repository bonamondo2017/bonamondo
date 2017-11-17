import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Components
 */
import { CompanyComponent } from './components/company/company.component';
import { CompanyTypeComponent } from './components/company-type/company-type.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LanguageComponent } from './components/language/language.component';
import { MainComponent } from './main.component';
import { ProductComponent } from './components/product/product.component';
import { UserRegisterComponent } from './components/user-register/user-register.component';

/**
 * Modules
 */
import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from './../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule
  ],
  declarations: [
    CompanyComponent,
    DashboardComponent, 
    MainComponent, 
    ProductComponent, 
    UserRegisterComponent, CompanyTypeComponent, LanguageComponent
  ]
})
export class MainModule { }
