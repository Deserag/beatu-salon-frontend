import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "environment/environment";
import { IReqPage } from "../work-page";
import { Observable } from "rxjs";
import { TResGetCabinet, TResGetOffice } from "./office.interface";

@Injectable({
  providedIn: 'root',
})
export class OfficeApiService {
    private _http = inject(HttpClient)
    private _baseURL = environment.apiService
    //проверить пути тута
    getOffice(body: IReqPage): Observable<TResGetOffice> {
        return this._http.post<TResGetOffice>(`${this._baseURL}office/office-list`, body);
    }

    getCabinets(body: IReqPage): Observable<TResGetCabinet>{
      return this._http.post<TResGetCabinet>(`${this._baseURL}office/cabinet-list`, body);
    }
}