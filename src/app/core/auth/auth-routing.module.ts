import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Sign In */
import { LoginComponent } from '../../user/login/login.component';

const routes: Routes = [
    { path: '', component: LoginComponent },
    // { path: 'register/code/{registerCode}', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
