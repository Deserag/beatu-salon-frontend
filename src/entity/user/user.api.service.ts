import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IGetRole,
  IGetUser,
  IUser,
  TResGetDepartment,
  TResGetRoles,
  TResGetUsers,
} from './user.interface';
import { environment } from 'environment/environment';
import { IReqPage } from '../work-page';
@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private _http = inject(HttpClient);
  private _baseURL = environment.apiService;

  getUser(body: IReqPage): Observable<TResGetUsers> {
    return this._http.post<TResGetUsers>(`${this._baseURL}user/list`, body);
  }

  getUserRole(body: IReqPage): Observable<TResGetRoles> {
    return this._http.post<TResGetRoles>(`${this._baseURL}user/list-roles`,body);
  }

  getUserDepartment(body: IReqPage): Observable<TResGetDepartment> {
    return this._http.post<TResGetDepartment>(`${this._baseURL}user/list-departments`,body);
  }

  createUser(body: IUser): Observable<IGetUser> {
    return this._http.post<IGetUser>(`${this._baseURL}user/create`, body);
  }

  createRole(body: IGetRole): Observable<IGetRole> {
    return this._http.post<IGetRole>(`${this._baseURL}user/create-role`, body);
  }

  createDepartment(body: IGetRole): Observable<IGetRole> {
    return this._http.post<IGetRole>(`${this._baseURL}user/create-department`,body);
  }

  updateUser(body: IUser): Observable<IGetUser> {
    return this._http.post<IGetUser>(`${this._baseURL}user/update`, body);
  }

  updateRole(body: IGetRole): Observable<IGetRole> {
    return this._http.post<IGetRole>(`${this._baseURL}user/update-role`, body);
  }

  updateDepartment(body: IGetRole): Observable<IGetRole> {
    return this._http.post<IGetRole>(`${this._baseURL}user/update-department`,body);
  }
}
