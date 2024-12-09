import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { API_URLS } from '../api-url.token';
import { IApiUrls } from '../api-url.token';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private _authService: AuthService,
        private _router: Router,
        @Inject(API_URLS) readonly apiUrls: IApiUrls
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<object>> {
        if (!req.url.includes(this.apiUrls.apiService) && !req.url.includes(this.apiUrls.authService)) {
            return next.handle(req);
        }

        const reqWithAuth = req.clone({
            headers: req.headers.set('Authorization', this._authService.token || ''),
        });

        return next.handle(reqWithAuth).pipe(
            catchError((err) => {
                if (
                    err instanceof HttpErrorResponse &&
                    err.status === 401 &&
                    !reqWithAuth.url.includes(this.apiUrls.authService)
                ) {
                    return this.#handle401Error(req, next);
                } else {
                    return throwError(() => err);
                }
            })
        );
    }

    #handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this._authService.refresh().pipe(
            switchMap(() => {
                return next.handle(this.#addAuthenticationToken(req));
            }),
            catchError((err) => {
                this._authService.logout();
                this._router.navigate(['/auth', 'login']).then();
                return throwError(() => err);
            })
        );
    }

    #addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
        return request.clone({
            headers: request.headers.set('Authorization', this._authService.token || ''),
        });
    }
}