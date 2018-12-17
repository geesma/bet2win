import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserHomePageComponent } from './user-home-page/user-home-page.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { IdCardComponent } from './id-card/id-card.component';

const userRoutes: Routes = [
    { path: 'subscription', component: SubscriptionComponent},
    { path: 'idCard', component: IdCardComponent},
    { path: '', component: UserHomePageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
