import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { UserComponent } from './user/user.component';
import { UsersTableComponent } from './users-table/users-table.component';
import { DataTableComponent } from '../layouts/ui/dashboard/elements/data-table/data-table.component';


@NgModule({
  declarations: [
    UserComponent,
    UsersTableComponent,
    DataTableComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    DataTablesModule
  ]
})
export class DashboardModule { }
