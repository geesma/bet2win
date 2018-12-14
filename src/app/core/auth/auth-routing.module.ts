import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Sign In */
import { RegisterComponent } from '../../user/register/register.component';
import { LoginComponent } from '../../user/login/login.component';
import { SubscriptionComponent } from 'src/app/user/subscription/subscription.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
    { path: '', redirectTo: 'login' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'register/:referalString', component: RegisterComponent },
    { path: 'subscription', component: SubscriptionComponent, canActivate: [AuthGuard]}
    // { path: 'register/code/{registerCode}', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
