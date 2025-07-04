import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ICreateDepartment,
  ICreateDepartmentResponse,
  ICreateUser,
  IDeleteDepartmentResponse,
  IDeleteRole,
  IDeleteUser,
  IGetRole,
  IGetUser,
  IUpdateUser,
  IUser,
  IUserDepartment,
  IUserRoles,
  TResGetDepartment,
  TResGetRoles,
  TResGetUsers,
} from './user.interface';
import { environment } from 'environment/environment';
import { IReqPage } from '../work-page';
import { AuthService } from '@entity';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private _http = inject(HttpClient);
  private _baseURL = environment.apiService;
  private _authService = inject(AuthService);

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

  createDepartment(
    body: ICreateDepartment
  ): Observable<ICreateDepartmentResponse> {
    return this._http.post<ICreateDepartmentResponse>(
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

  updateDepartment(body: any): Observable<any> {
    return this._http.put<any>(`${this._baseURL}user/update-department`, body);
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

  deleteUser(dto: { userId: string; adminId: string }): Observable<any> {
    return this._http.delete<any>(`${this._baseURL}user/delete-user`, {
      body: dto,
    });
  }
  // 4cac872b-36c8-4759-90e5-1e782aa1a8b1

  deleteDepartment(
    departmentId: string
  ): Observable<IDeleteDepartmentResponse> {
    const userId = this._authService.user?.id;
    return this._http.delete<IDeleteDepartmentResponse>(
      `${this._baseURL}user/delete-department/${departmentId}`,
      { body: { adminId: userId } }
    );
  }
}
