import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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

const routes: Routes = [{
  path: '', component: MainComponent, children: [{
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }, { 
    path: 'dashboard', 
    component: DashboardComponent 
  }, { 
    path: 'dashboard/:id', 
    component: DashboardComponent 
  }, { 
    path: 'product', 
    component: ProductComponent 
  }, { 
    path: 'product/:id', 
    component: ProductComponent 
  }, { 
    path: 'company', 
    component: CompanyComponent 
  }, { 
    path: 'company/:id', 
    component: CompanyComponent 
  }, { 
    path: 'company-type', 
    component: CompanyTypeComponent 
  }, { 
    path: 'company-type/:id', 
    component: CompanyTypeComponent 
  }, { 
    path: 'language', 
    component: LanguageComponent
  }, { 
    path: 'language/:id', 
    component: LanguageComponent
  }, {
    path: 'user-register',
    component: UserRegisterComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {
 }
