import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserHomePageComponent } from './user-home-page/user-home-page.component';
import { AuthGuard } from '../core/auth/auth.guard';

const userRoutes: Routes = [
    { path: '', component: UserHomePageComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
