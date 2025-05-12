import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "environment/environment";
import { IReqPage } from "../work-page";
import { Observable } from "rxjs";
import { IDeleteClient, TResGetClients } from "./clients.interface";

@Injectable({
  providedIn: 'root',
})
export class ClientApiService {
      private _http = inject(HttpClient);
      private _baseURL = environment.apiService;

      getClients(body: IReqPage): Observable<TResGetClients>{
        return this._http.post<TResGetClients>(`${this._baseURL}clients/list`, body)
      }
      deleteClient(userId: string): Observable<IDeleteClient> {
          return this._http.delete<IDeleteClient>(
            `${this._baseURL}user/delete-user/${userId}`
          );
        }
}