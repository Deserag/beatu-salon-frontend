import { IResTablePage } from "../work-page";

export interface IServices {
    id: string;
    name: string;
    description: string;
    price: number;
    creatorId: string;
}

export interface IProducts {
    id: string
    name: string
    description: string
    volume: string
    unit: string
    quantity: number
    prices: number
    creatorId: string
}

export interface ICreateService {
    name: string;
    description: string;
    price: string;
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
    id: string
}

export interface IUpdateProduct extends ICreateProduct {
    id: string
}


export interface IGetService {
    name: string;
    page: number;
    size: number;
    totalCount: number;
    totalPages: number;
}

export interface IGetProduct {
    name: string;
    page: number;
    size: number;
    totalCount: number;
    totalPages: number;
}

export type TResGetService = IResTablePage<IServices>
export type TresGetProduct = IResTablePage<IProducts>