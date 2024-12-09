import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IGetUser, IUser } from "./user.interface";
import { environment } from "environment/environment";
@Injectable({
    providedIn: 'root',
  })
export class UserApiService {
    private _http = inject(HttpClient)
    private _baseURL = environment.apiService

    getUser(): Observable<IGetUser>{
        return this._http.get<IGetUser>(`${this._baseURL}user/list`);
    }
}