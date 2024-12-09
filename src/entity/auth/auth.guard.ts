import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';

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
		const decodedToken = this._authService.decodeToken();

		if (!decodedToken) {
			sessionStorage.setItem('redirectUrl', state.url);
			this._router.navigate(['auth']).then();
			return false;
		}

		if (decodedToken.sub !== 1) {
			alert('Вы не администратор, доступ запрещен!');
			this._router.navigate(['auth']).then();
			return false;
		}

		return true;
	}
}
