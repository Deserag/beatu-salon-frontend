import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "environment/environment";
import { IReqPage } from "../work-page";
import { Observable } from "rxjs";
import { IUpdateProduct, IUpdateService, TresGetProduct, TResGetProductSale, TResGetService } from "./services.interface";

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

    //тестовый запрос
    getProductSale(body: IReqPage): Observable<TResGetProductSale> {
        return this._http.post<TResGetProductSale>(`${this._baseURL}service/products-sale-list`, body);
    }

    getServiceById(id: string): Observable<TResGetService> {
        return this._http.get<TResGetService>(`${this._baseURL}service/service/${id}`);
    }

    updateService(body: IUpdateService): Observable<IUpdateService> {
        return this._http.put<IUpdateService>(`${this._baseURL}service/update-service`, body);
    }

    updateProduct(body: IUpdateProduct): Observable<IUpdateProduct> {
        return this._http.put<IUpdateProduct>(`${this._baseURL}service/update-product`, body);
    }
}