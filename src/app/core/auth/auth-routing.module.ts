import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Sign In */
import { LoginComponent } from '../../user/login/login.component';
import { SubscriptionComponent } from 'src/app/user/subscription/subscription.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
    { path: '', redirectTo: 'login' },
    { path: 'login', component: LoginComponent },
    { path: 'subscription', component: SubscriptionComponent, canActivate: [AuthGuard]}
    // { path: 'register/code/{registerCode}', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
