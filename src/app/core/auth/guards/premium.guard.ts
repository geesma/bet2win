import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PremiumGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.auth.user.pipe(
      take(1),
      map(user => user && user.roles.premium ? true : false),
      tap(isAdmin => {
        if (!isAdmin) {
          console.error('Access denied - Premium only')
          this.router.navigate(['dashboard']);
        }
      })
    );
  }
}
