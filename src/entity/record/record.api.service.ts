import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICreateRecord, IUpdateRecord, TResGetRecord } from './record.interface';
import { Observable } from 'rxjs';
import { environment } from 'environment/environment';
import { IUser } from '../user';

@Injectable({ providedIn: 'root' })
export class RecordApiService {
  private _http = inject(HttpClient);
  private _base = environment.apiService;

  getRecords(params: { page: number; size: number }): Observable<TResGetRecord> {
    return this._http.post<TResGetRecord>(`${this._base}record/list`, params);
  }

  createRecord(data: ICreateRecord): Observable<any> {
    return this._http.post(`${this._base}record/create`, data);
  }

  updateRecord(data: IUpdateRecord): Observable<any> {
    return this._http.put(`${this._base}record/update`, data);
  }

getMastersByService(serviceId: string): Observable<IUser[]> {
  return this._http.get<IUser[]>(
    `${this._base}record/masters-by-service`,
    { params: { serviceId } }
  );
}
}
