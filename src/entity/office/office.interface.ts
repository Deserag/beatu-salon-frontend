import { IResTablePage } from "../work-page"

export interface IOffice {
    id: string
    number: string
    address: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
    creatorId: string
}

export interface ICabinet {
  id: string
  number: string
  officeId: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
  creatorId: string
}

export interface IGetOffice {
  office: IOffice
}

export interface iGetCabinet {
  cabinet: ICabinet
}

export interface ICreateOffice {
    number: string;
    address: string;
    creatorId: string;
}
  
export interface IUpdateOffice extends ICreateOffice {
    id: string;
}

export interface IDeleteOffice {
  id: string;
  creatorId: string;
}

export interface ICreateCabinet {
  number: string;
  officeId:string;
  creatorId: string;
}
export interface IUpdateCabinet extends ICreateCabinet {
  id: string;
}

export interface IDeleteCabinet {
  id: string;
  creatorId: string;
}

export type TResGetOffice = IResTablePage<IOffice>
export type TResGetCabinet = IResTablePage<ICabinet>