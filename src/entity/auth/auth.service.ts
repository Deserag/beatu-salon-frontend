import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { EAuthKeys, IReqAuthLogin, IResAuthLogin,API_URLS, IApiUrls }  from '@entity';
import { v7 } from 'uuid';
import { jwtDecode } from 'jwt-decode';
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
    return this._http
      .post<IResAuthLogin>(`${this.apiUrls.authService}api/auth/sign-in`, data)
      .pipe(
        tap((res) => {
          if (res.data && res.data.access) {
            this.#setToken(res.data.access);
          } else {
          }
          const decodedToken = this.decodeToken();
          if (decodedToken) {
          }
        })
      );
  }

  decodeToken(): any {
    const token = this.token;
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.sub === 1) {
          return decoded;
        } else {
          return null;
        }
      } catch (error) {
        return null;
      }
    } else {
      return null;
    }
  }

  #setToken(token: string): void {
    localStorage.setItem(EAuthKeys.TOKEN, token);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout(): void {
    sessionStorage.removeItem(EAuthKeys.TOKEN);
    localStorage.removeItem(EAuthKeys.TOKEN);
    this._isAuthenticated$.next(false);
    this._router.navigate([ERouteConstans.LOGIN]);
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
}
