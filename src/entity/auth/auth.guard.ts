import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { ERoles } from '@auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  private _authService = inject(AuthService);
  private _router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this._checkAuthentication(state.url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this._checkAuthentication(state.url);
  }

  private _checkAuthentication(url: string): boolean {
    const user = this._authService.user;

    if (!user) {
      console.log('AuthGuard (', url, '): Пользователь не найден, редирект на логин');
      sessionStorage.setItem('redirectUrl', url);
      this._router.navigate(['auth', 'login']).then();
      return false;
    }
    console.log('AuthGuard (', url, '): Пользователь найден, доступ разрешен');
    return true;
  }
}