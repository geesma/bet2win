import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeveloperGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.auth.user.pipe(
      take(1),
      map(user => user && user.roles.developer ? true : false),
      tap(isAdmin => {
        if (!isAdmin) {
          console.error('Access denied - Developers only')
          this.router.navigate(['dashboard']);
        }
      })
    );
  }
}
