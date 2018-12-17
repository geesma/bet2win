import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService} from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    this.auth.user.subscribe((user) => {
      if (user) {
        console.log("access granted");
      }
      else {
        console.log("access denied");
        this.router.navigate(['login']);
      }
    })
    return true;
  }
}
