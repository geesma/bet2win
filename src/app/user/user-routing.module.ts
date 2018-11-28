import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserHomePageComponent } from './user-home-page/user-home-page.component';

const userRoutes: Routes = [
    { path: 'helllo', component: UserHomePageComponent},
    { path: 'logged', component: UserHomePageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
