import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environment/environment';
import { IReqPage } from '../work-page';
import { Observable } from 'rxjs';
import {
  IDeleteClient,
  TResGetClients,
  TResGetClientsOrders,
  IClientsOrders,
  IDeleteOrder,
  IClient, 
} from './clients.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientApiService {
  private _http = inject(HttpClient);
  private _baseURL = environment.apiService;

  getClients(body: IReqPage): Observable<TResGetClients> {
    return this._http.post<TResGetClients>(`${this._baseURL}client/list`, body);
  }

  createClient(client: Partial<IClient>): Observable<IClient> {
    return this._http.post<IClient>(`${this._baseURL}client/create`, client);
  }

  updateClient(clientId: string, client: Partial<IClient>): Observable<IClient> {
    return this._http.put<IClient>(`${this._baseURL}client/update/${clientId}`, client);
  }

  deleteClient(userId: string): Observable<IDeleteClient> {
    return this._http.delete<IDeleteClient>(
      `${this._baseURL}user/delete-user/${userId}`
    );
  }

  deleteOrder(userId: string): Observable<IDeleteOrder> {
    return this._http.delete<IDeleteOrder>(
      `${this._baseURL}client/orders/delete/${userId}`
    );
  }

  getOrders(body: IReqPage): Observable<TResGetClientsOrders> {
    return this._http.post<TResGetClientsOrders>(
      `${this._baseURL}client/orders/list`,
      body
    );
  }

  createOrder(order: Partial<IClientsOrders>): Observable<IClientsOrders> {
    return this._http.post<IClientsOrders>(
      `${this._baseURL}client/create-order`,
      order
    );
  }

  updateOrder(
    id: string,
    order: Partial<IClientsOrders>
  ): Observable<IClientsOrders> {
    return this._http.put<IClientsOrders>(
      `${this._baseURL}client/orders/update/${id}`,
      order
    );
  }
}