import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService} from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    // if (this.auth.isLoggedIn()) {
    //   //console.log(this.auth.isLoggedIn())
    //   return true;
    // }
    console.log("access granted");
    //this.router.navigate(['/']);
    return true;
  }
}
