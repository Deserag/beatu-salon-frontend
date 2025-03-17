import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { ERoles } from '@auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  private _authService = inject(AuthService);
  private _router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this._checkAuthentication(route, state);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this._checkAuthentication(route, state);
  }

  private _checkAuthentication(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this._authService.user;

    if (!user) {
      sessionStorage.setItem('redirectUrl', state.url);
      this._router.navigate(['auth']).then();
      return false;
    }

    if (user.roles !== ERoles.ADMIN) {
      alert('Вы не администратор, доступ запрещен!');
      this._router.navigate(['auth']).then();
      return false;
    }

    return true;
  }
}