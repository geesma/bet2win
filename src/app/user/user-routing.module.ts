import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserHomePageComponent } from './user-home-page/user-home-page.component';
import { SubscriptionComponent } from './subscription/subscription.component';

const userRoutes: Routes = [
    { path: '', component: UserHomePageComponent},
    { path: 'subscription', component: SubscriptionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
