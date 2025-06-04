import { IResTablePage } from '../work-page';

export interface IService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  creatorId: string;
}
export interface IServiceNode {
  id: string;
  name: string;
  isService: boolean;
  workers?: IWorkerNode[];
}
export interface CreateWorkerOnServiceDTO {
  serviceId: string;
  userIds: string[];
  creatorId: string;
}

export interface IWorkerNode {
  id: string;
  name: string;
  isService: boolean;
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  volume: string;
  unit: string;
  quantity: number;
  prices: number;
  creatorId: string;
}

export interface IProductSale extends IProduct {
  office: string;
}

export interface ICreateService {
  name: string;
  description: string;
  price: string;
  duration: Float32Array;
  creatorId: string;
}

export interface ICreateProduct {
  name: string;
  description: string;
  volume: string;
  unit: string;
  quantity: number;
  prices: number;
  creatorId: string;
}

export interface IUpdateService extends ICreateService {
  id: string;
}

export interface IUpdateProduct extends ICreateProduct {
  id: string;
}

export interface IWorkerOnService {
  serviceId: string;
  userId: string;
  worker: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface IWorkerWithService {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
}

export interface IServiceWithWorkers {
  id: string;
  name: string;
  workers: IWorkerWithService[];
}

export interface IGetServicesWithWorkersResponse
  extends IResTablePage<IServiceWithWorkers> {}
export type TResGetWorkerOnService = IResTablePage<IWorkerOnService>;
export type TResGetService = IResTablePage<IService>;
export type TResGetProduct = IResTablePage<IProduct>;
export type TResGetProductSale = IResTablePage<IProductSale>;
