import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from "./product/product.component";
import { ProductDetailComponent } from "./product-detail/product-detail.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { Login2Component } from "./login2/login2.component";
import { LoginComponent } from "./login/login.component";
import { RouteGuardService } from "../services/routeguard.service";
import { ProductService } from "../../toolkit/server/webapi/product.service";
import { OrganComponent } from './organ/organ.component';
import { OrganDetailComponent } from './organ-detail/organ-detail.component';
import { OrganService } from "../../toolkit/server/webapi/organ.service";
import { AccountComponent } from './account/account.component';
import { SolutionComponent } from "./solution/solution.component";
import { SolutionDetailComponent } from "./solution-detail/solution-detail.component";
import { SolutionService } from "../../toolkit/server/webapi/solution.service";
const routes: Routes = [
  { path: 'app/login', component: LoginComponent }
  , { path: 'app/login2', component: Login2Component }
  , { path: 'app/dashboard', component: DashboardComponent, canActivate: [RouteGuardService] }
  , { path: 'app/products', component: ProductComponent, canActivate: [RouteGuardService] }
  , { path: 'app/organ', component: OrganComponent, canActivate: [RouteGuardService] }
  , { path: 'app/solutions', component: SolutionComponent, canActivate: [RouteGuardService] }
  , { path: 'app/organ-account', component: AccountComponent, canActivate: [RouteGuardService] }
  , {
    path: 'app/product-detail/:id'
    , component: ProductDetailComponent
    , canActivate: [RouteGuardService],
    resolve: {
      entity: ProductService
    }
  }
  , { path: 'app/product-detail', component: ProductDetailComponent, canActivate: [RouteGuardService] }
  , {
    path: 'app/organ-detail/:id'
    , component: OrganDetailComponent
    , canActivate: [RouteGuardService],
    resolve: {
      entity: OrganService
    }
  }
  , { path: 'app/organ-detail', component: OrganDetailComponent, canActivate: [RouteGuardService] }
  , {
    path: 'app/solution-detail/:id'
    , component: SolutionDetailComponent
    , canActivate: [RouteGuardService],
    resolve: {
      entity: SolutionService
    }
  }
  , { path: 'app/solution-detail', component: SolutionDetailComponent, canActivate: [RouteGuardService] }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BambooRoutingModule { }
