import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule }   from '@angular/forms';

/* Components */
import { LoginComponent } from '../../user/login/login.component';

/* Modules */
import { AuthRoutingModule } from './auth-routing.module';
import { CoreModule } from '../core.module';

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
  ]
})
export class AuthModule { }
