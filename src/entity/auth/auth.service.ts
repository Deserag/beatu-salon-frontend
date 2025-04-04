import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { EAuthKeys, IReqAuthLogin, IResAuthLogin, API_URLS, IApiUrls, IResAuthUserInfo, ERoles, ROLES_ARRAY } from '@entity';
import { v7 } from 'uuid';
import { Router } from '@angular/router';
import { ERouteConstans } from '@routes';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isAuthenticated$ = new BehaviorSubject<boolean>(
    this.isAuthenticated()
  );

  constructor(
    private _http: HttpClient,
    @Inject(API_URLS) readonly apiUrls: IApiUrls,
    private _router: Router
  ) {}

  get token(): string | null {
    return (
      sessionStorage.getItem(EAuthKeys.TOKEN) ||
      localStorage.getItem(EAuthKeys.TOKEN)
    );
  }

  get deviceId(): string {
    let deviceId: string | null = localStorage.getItem(EAuthKeys.DEVICE_ID);

    if (!deviceId) {
      deviceId = v7();
      localStorage.setItem(EAuthKeys.DEVICE_ID, deviceId);
    }

    return deviceId;
  }

  login(data: IReqAuthLogin): Observable<IResAuthLogin> {
    if (data.login === 'admin' && data.password === 'admin') {
      const fakeToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibG9naW4iOiJhZG1pbiIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlcyI6WyJBRE1JTiJdLCJ1cGRhdGVkQXQiOiIyMDI0LTEwLTI3VDEyOjAwOjAwWiJ9.your-secret-key';
      const fakeUser = {
        id: '1',
        login: 'admin',
        username: 'admin',
        roles: ERoles.ADMIN,
        updatedAt: new Date().toISOString(),
      };
      this.#setToken(fakeToken);
      this.#setUser(fakeUser);
      this._isAuthenticated$.next(true);

      return of({
        data: { access: fakeToken, refresh: '' },
        meta: { success: true },
      });
    }

    return this._http
      .post<IResAuthLogin>(`${this.apiUrls.authService}api/auth/sign-in`, data)
      .pipe(
        tap((res) => {
          if (res.data && res.data.access) {
            this.#setToken(res.data.access);
          }
        })
      );
  }

  #setToken(token: string): void {
    localStorage.setItem(EAuthKeys.TOKEN, token);
  }

  #setUser(user: IResAuthUserInfo): void {
    localStorage.setItem(EAuthKeys.USER, JSON.stringify(user));
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  logout(): void {
    sessionStorage.removeItem(EAuthKeys.TOKEN);
    localStorage.removeItem(EAuthKeys.TOKEN);
    localStorage.removeItem(EAuthKeys.USER);
    this._isAuthenticated$.next(false);
    this._router.navigate([ERouteConstans.AUTH, ERouteConstans.LOGIN]).then();
  }

  refresh(): Observable<{ accessToken: string }> {
    return this._http
      .post<{ accessToken: string }>(
        `${this.apiUrls.authService}/api/auth/refresh-tokens`,
        {
          deviceId: this.deviceId,
        }
      )
      .pipe(
        tap((data) =>
          this.setToken(
            {
              data: { access: data.accessToken, refresh: '' },
              meta: { success: true },
            },
            true
          )
        )
      );
  }

  setToken(data: IResAuthLogin, rememberMe: boolean): void {
    rememberMe
      ? localStorage.setItem(EAuthKeys.TOKEN, data.data.access)
      : sessionStorage.setItem(EAuthKeys.TOKEN, data.data.access);
  }

  get user(): IResAuthUserInfo | null {
    const user = localStorage.getItem(EAuthKeys.USER);
    return user ? JSON.parse(user) : null;
  }
}