import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environment/environment';
import { IReqPage } from '../work-page';
import {
  IOffice,
  ICreateOffice,
  IUpdateOffice,
  TResGetCabinet,
  TResGetOffice,
  IDeleteOffice,
  ICabinet,
  ICreateCabinet,
  IUpdateCabinet,
  IDeleteCabinet,
} from './office.interface';
@Injectable({
  providedIn: 'root',
})
export class OfficeApiService {
  private _http = inject(HttpClient);
  private _baseURL = environment.apiService;

  getOffice(body: IReqPage): Observable<TResGetOffice> {
    return this._http.post<TResGetOffice>(`${this._baseURL}office/list`, body);
  }

  getCabinets(body: IReqPage): Observable<TResGetCabinet> {
    return this._http.post<TResGetCabinet>(`${this._baseURL}office/list-cabinets`, body);
  }

  createOffice(body: ICreateOffice): Observable<IOffice> {
    return this._http.post<IOffice>(`${this._baseURL}office/create-office`, body);
  }

  updateOffice(body: IUpdateOffice): Observable<IOffice> {
    return this._http.put<IOffice>(`${this._baseURL}office/update-office`, body);
  }

  deleteOffice(body: IDeleteOffice): Observable<IDeleteOffice> {
    return this._http.delete<IDeleteOffice>(`${this._baseURL}office/delete-office`, { body });
  }

  createCabinet(body: ICreateCabinet): Observable<ICabinet> {
    return this._http.post<ICabinet>(`${this._baseURL}office/create-cabinet`, body);
  }

  updateCabinet(body: IUpdateCabinet): Observable<ICabinet> {
    return this._http.put<ICabinet>(`${this._baseURL}office/update-cabinet`, body);
  }

  deleteCabinet(body: IDeleteCabinet): Observable<IDeleteCabinet> {
    return this._http.delete<IDeleteCabinet>(`${this._baseURL}office/delete-cabinet`, { body });
  }
  getCabinetsByOffice(body: IReqPage): Observable<TResGetCabinet> {
    return this._http.post<TResGetCabinet>(`${this._baseURL}office/list-cabinets`, body);
  }
}
