import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Sign In */
import { RegisterComponent } from '../../user/register/register.component';
import { LoginComponent } from '../../user/login/login.component';

const routes: Routes = [
    { path: '', redirectTo: 'login' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
