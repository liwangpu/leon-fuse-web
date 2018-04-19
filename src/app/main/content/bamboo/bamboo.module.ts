import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BambooRoutingModule } from './bamboo-routing.module';
import { ProductComponent } from './product/product.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ToolkitModule } from "../../toolkit/toolkit.module";
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { IconItemComponent } from "./common/iconitem.component";
import { SharedModule } from '../../../core/modules/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CdkTableModule } from '@angular/cdk/table';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Login2Component } from './login2/login2.component';
import { LoginComponent } from "./login/login.component";
import { ServicesModule } from "../services/services.module";
import { OrganComponent } from './organ/organ.component';
import { OrganDetailComponent } from './organ-detail/organ-detail.component';
import { OrganDepartmentComponent } from './organ-department/organ-department.component';
import { MatSelectModule } from '@angular/material/select';
import { FuseContactsModule } from "./contacts/contacts.module";
import { MatSidenavModule } from '@angular/material/sidenav';
import { OAdminComponent } from './organ-department/o-admin/o-admin.component';
import { OAccountComponent } from './organ-department/o-account/o-account.component';
import { OAccountDetailComponent } from './organ/o-account-detail/o-account-detail.component';
import { AccountComponent } from './account/account.component';
import { AccountDetailComponent } from './account/account-detail/account-detail.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DepartmentCardComponent } from './account/department-card/department-card.component';
import { AccountListComponent } from './account/account-list/account-list.component';
@NgModule({
  imports: [
    ServicesModule,
    SharedModule,
    CommonModule,
    MatSidenavModule,
    MatStepperModule,
    BrowserAnimationsModule,
    BambooRoutingModule,
    FormsModule,
    MatDatepickerModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    TranslateModule,
    FlexLayoutModule,
    ToolkitModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatGridListModule,
    MatFormFieldModule,
    CdkTableModule,
    MatInputModule,
    FuseContactsModule
  ],
  declarations: [ProductComponent, ProductDetailComponent, IconItemComponent, DashboardComponent, Login2Component, LoginComponent, OrganComponent, OrganDetailComponent, OrganDepartmentComponent, OAdminComponent, OAccountComponent, OAccountDetailComponent, AccountComponent, AccountDetailComponent, DepartmentCardComponent, AccountListComponent],
  entryComponents: [AccountDetailComponent]
})
export class BambooModule { }
