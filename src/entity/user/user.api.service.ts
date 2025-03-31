import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ICreateDepartment,
  ICreateUser,
  IDeleteDepartment,
  IDeleteRole,
  IDeleteUser,
  IGetRole,
  IGetUser,
  IUpdateUser,
  IUser,
  IUserDepartment,
  IUserEarnings,
  IUserRoles,
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

  getUserInfo(id: string): Observable<IGetUser> {
    return this._http.get<IGetUser>(`${this._baseURL}user/${id}`);
  }

  getUserRole(body: IReqPage): Observable<TResGetRoles> {
    return this._http.post<TResGetRoles>(
      `${this._baseURL}user/list-roles`,
      body
    );
  }

  getUserEarnings(userId: string): Observable<IUserEarnings> {
    return this._http.get<IUserEarnings>(`${this._baseURL}users-earnings/${userId}`);
  }

  getUsersWithDepartment(departmentId: string): Observable<IUser[]> {
    return this._http.get<IUser[]>(`${this._baseURL}users-department/${departmentId}`);
  }

  getUserDepartment(body: IReqPage): Observable<TResGetDepartment> {
    return this._http.post<TResGetDepartment>(
      `${this._baseURL}user/list-departments`,
      body
    );
  }

  createUser(body: ICreateUser): Observable<ICreateUser> {
    return this._http.post<ICreateUser>(
      `${this._baseURL}user/create-user`,
      body
    );
  }

  createRole(body: IGetRole): Observable<IGetRole> {
    return this._http.post<IGetRole>(`${this._baseURL}user/create-role`, body);
  }

  createDepartment(body: ICreateDepartment): Observable<ICreateDepartment> {
    return this._http.post<ICreateDepartment>(
      `${this._baseURL}user/create-department`,
      body
    );
  }

  updateUser(body: IUpdateUser): Observable<IUpdateUser> {
    return this._http.put<IUpdateUser>(`${this._baseURL}user/update`, body);
  }

  updateRole(body: IGetRole): Observable<IGetRole> {
    return this._http.post<IGetRole>(`${this._baseURL}user/update-role`, body);
  }

  updateDepartment(body: IGetRole): Observable<IGetRole> {
    return this._http.post<IGetRole>(
      `${this._baseURL}user/update-department`,
      body
    );
  }

  getUserRoles(): Observable<IUserRoles[]> {
    return this._http.get<IUserRoles[]>(`${this._baseURL}user/user-roles`);
  }

  getDepartaments(): Observable<IUserDepartment[]> {
    return this._http.get<IUserDepartment[]>(
      `${this._baseURL}user/user-departaments`
    );
  }

  deleteRole(userId: string, roleId: string): Observable<IDeleteRole> {
    return this._http.delete<IDeleteRole>(`${this._baseURL}user/delete-role`, {
      body: { userId, roleId },
    });
  }

  deleteUser(userId: string): Observable<IDeleteUser> {
    return this._http.delete<IDeleteUser>(
      `${this._baseURL}user/delete-user/${userId}`
    );
  }

  deleteDepartment(departmentId: string): Observable<IDeleteDepartment> {
    return this._http.delete<IDeleteDepartment>(
      `${this._baseURL}user/delete-department/${departmentId}`
    );
  }
}
