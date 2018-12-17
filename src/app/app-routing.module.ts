import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';

import { AuthGuard } from './core/auth/auth.guard';
import { RegisterLayoutComponent } from './layouts/register-layout/register-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';

const routes: Routes = [
  { path: 'login', component: LoginLayoutComponent ,loadChildren:  './core/auth/auth.module#AuthModule'},
  { path: 'register', component: RegisterLayoutComponent ,loadChildren:  './core/auth/register/register.module#RegisterModule'},
  { path: 'user', component: UserLayoutComponent , loadChildren: './user/user.module#UserModule' , canActivate: [AuthGuard]},
  { path: 'dashboard', component: DashboardLayoutComponent , loadChildren: './dashboard/dashboard.module#DashboardModule' , canActivate: [AuthGuard]},
  { path: 'error', loadChildren: './errors/errors.module#ErrorsModule'},
  { path: '**', redirectTo: '/error/404', pathMatch: 'full' },
  // { path: 'user/register', loadChildren:  './core/auth/auth.module#AuthModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
