import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule }   from '@angular/forms';

/* Components */
import { RegisterComponent } from '../../user/register/register.component';
import { LoginComponent } from '../../user/login/login.component';
import { SubscriptionComponent } from '../../user/subscription/subscription.component';

/* Modules */
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    SubscriptionComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
