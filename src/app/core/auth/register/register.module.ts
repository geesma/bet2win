import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import { FormsModule ,ReactiveFormsModule }   from '@angular/forms';

/* Components */
import { RegisterComponent } from '../../../user/register/register.component';
import { InfoComponent } from 'src/app/user/register/info/info.component';
import { EmailConfirmationComponent } from 'src/app/user/register/email-confirmation/email-confirmation.component'
import { ReferalComponent } from 'src/app/user/register/referal/referal.component';
import { CoreModule } from '../../core.module';

@NgModule({
  declarations: [
    RegisterComponent,
    InfoComponent,
    EmailConfirmationComponent,
    ReferalComponent
  ],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule
  ]
})
export class RegisterModule { }
