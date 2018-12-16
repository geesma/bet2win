import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Components */
import { RegisterComponent } from '../../../user/register/register.component';

@NgModule({
  declarations: [
      RegisterComponent,
  ],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RegisterModule { }
