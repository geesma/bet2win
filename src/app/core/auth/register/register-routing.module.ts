import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from 'src/app/user/register/register.component';
import { InfoComponent } from 'src/app/user/register/info/info.component';
import { EmailConfirmationComponent } from 'src/app/user/register/email-confirmation/email-confirmation.component';
import { ReferalComponent } from 'src/app/user/register/referal/referal.component';

const routes: Routes = [
  { path: '', component: RegisterComponent },
  { path: 'information', component: InfoComponent },
  { path: 'confirmation', component: EmailConfirmationComponent },
  { path: 'referal', component: ReferalComponent },
  { path: 'information/:referalString', component: InfoComponent },
  { path: 'confirmation/:referalString', component: EmailConfirmationComponent },
  { path: ':referalString', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }
