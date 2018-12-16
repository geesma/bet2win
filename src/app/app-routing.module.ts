import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';

import { AuthGuard } from './core/auth/auth.guard';

const routes: Routes = [
  { path: 'user', component: LoginLayoutComponent ,loadChildren:  './core/auth/auth.module#AuthModule'},
  { path: 'user', component: LoginLayoutComponent ,loadChildren:  './core/auth/register/register.module#RegisterModule'},
  { path: 'dashboard', component: UserLayoutComponent , loadChildren: './user/user.module#UserModule' , canActivate: [AuthGuard]},
  { path: 'error', loadChildren: './errors/errors.module#ErrorsModule'},
  { path: '**', redirectTo: '/error/404', pathMatch: 'full' },
  // { path: 'user/register', loadChildren:  './core/auth/auth.module#AuthModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
