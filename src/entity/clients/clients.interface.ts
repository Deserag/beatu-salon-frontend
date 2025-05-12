import { IResTablePage } from "../work-page";

export interface IClient {
    id: string,
    firstName: string,
    lastName:  string,

}
export interface IClientsOrders {

}

export interface IDeleteClient{
    adminId: string;
    userId: string;
  }

export type TResGetClients = IResTablePage<IClient>
export type TResGetClientsOrders = IResTablePage<IClientsOrders>