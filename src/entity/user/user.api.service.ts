import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IGetRole, IGetUser, IUser, TResGetRoles, TResGetUsers } from "./user.interface";
import { environment } from "environment/environment";
import { IReqPage } from "../work-page";
@Injectable({
    providedIn: 'root',
  })
export class UserApiService {
    private _http = inject(HttpClient)
    private _baseURL = environment.apiService

    getUser(body: IReqPage): Observable<TResGetUsers> {
        return this._http.post<TResGetUsers>(`${this._baseURL}user/list`, body);
      }

      getUserRole(body: IReqPage): Observable<TResGetRoles> {
        return this._http.post<TResGetRoles>(`${this._baseURL}user/list-roles`, body);
      }
}