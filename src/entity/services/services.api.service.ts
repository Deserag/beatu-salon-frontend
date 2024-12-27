import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "environment/environment";
import { IReqPage } from "../work-page";
import { Observable } from "rxjs";
import { TresGetProduct, TResGetService } from "./services.interface";

@Injectable({
    providedIn: 'root'
})
export class ServicesApiService {
    private _http = inject(HttpClient)
    private _baseURL = environment.apiService


    getService(body: IReqPage): Observable<TResGetService> {
        return this._http.post<TResGetService>(`${this._baseURL}service/services-list`, body);
    }

    getProduct(body: IReqPage): Observable<TresGetProduct> {
        return this._http.post<TresGetProduct>(`${this._baseURL}service/products-list`, body);
    }
}