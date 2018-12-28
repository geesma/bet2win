import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserRoutingModule } from './user-routing.module';

/* Components */
import { UserHomePageComponent } from './user-home-page/user-home-page.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { IdCardComponent } from './id-card/id-card.component';
import { PaymentComponent } from './subscription/payment/payment.component';

@NgModule({
  declarations: [
    UserHomePageComponent,
    SubscriptionComponent,
    IdCardComponent,
    PaymentComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: []
})
export class UserModule { }
