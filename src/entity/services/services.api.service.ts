import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "environment/environment";
import { IReqPage } from "../work-page";
import { Observable } from "rxjs";
import { IUpdateProduct, IUpdateService, TResGetProduct, TResGetProductSale, TResGetService, IServiceWithWorkers, CreateWorkerOnServiceDTO, IWorkerOnService, ICreateService } from "./services.interface";


@Injectable({
  providedIn: 'root'
})
export class ServicesApiService {
  private _http = inject(HttpClient);
  private _baseURL = environment.apiService;

  getService(body: IReqPage): Observable<TResGetService> {
    return this._http.post<TResGetService>(`${this._baseURL}service/services-list`, body);
  }

  getProduct(body: IReqPage): Observable<TResGetProduct> {
    return this._http.post<TResGetProduct>(`${this._baseURL}service/products-list`, body);
  }

  getProductSale(body: IReqPage): Observable<TResGetProductSale> {
    return this._http.post<TResGetProductSale>(`${this._baseURL}service/products-sale-list`, body);
  }

  getServiceById(id: string): Observable<TResGetService> {
    return this._http.get<TResGetService>(`${this._baseURL}service/service/${id}`);
  }

  createService(body: ICreateService): Observable<ICreateService> {
    return this._http.post<ICreateService>(`${this._baseURL}service/create-service`, body);
  }
  updateService(body: IUpdateService): Observable<IUpdateService> {
    return this._http.put<IUpdateService>(`${this._baseURL}service/update-service`, body);
  }

  updateProduct(body: IUpdateProduct): Observable<IUpdateProduct> {
    return this._http.put<IUpdateProduct>(`${this._baseURL}service/update-product`, body);
  }

  getServicesWithWorkers(body: IReqPage): Observable<IWorkerOnService[]> {
    return this._http.post<IWorkerOnService[]>(
      `${this._baseURL}service/worker-on-service/list`,
      body
    );
  }

  createWorkerOnService(dto: CreateWorkerOnServiceDTO): Observable<any> {
    return this._http.post(`${this._baseURL}service/worker-on-service`, dto);
  }
}