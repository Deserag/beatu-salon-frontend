import { IResTablePage } from "../work-page";

export interface IClient {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
}

export interface IWorker {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
}
export interface IClientsOrders {
  id?: string;
  clientId: string;
  workerId: string;
  dateTime: string; 
  serviceId: string;
  officeId: string;
  workCabinetId: string;
  result?: string; 
}

export interface IDeleteOrder {
  adminId: string;
  orderId: string;
}

export interface IDeleteClient {
  adminId: string;
  userId: string;
}


export type TResGetClients = IResTablePage<IClient>;
export type TResGetClientsOrders = IResTablePage<IClientsOrders>;
export type TResGetWorkers = IResTablePage<IWorker>;
