import { IOffice } from "../office";
import { IService } from "../services";
import { IUser } from "../user";

export interface IRecord {
  id: string;
  userId: string; 
  workerId: string; 
  dateTime: string; 
  officeId: string; 
  workCabinetId: string; 
  result: any | null; 
  createdAt: string; 
  updatedAt: string;
  deletedAt: string | null; 

  user?: IUser;
  worker?: IUser; 
  service?: IService;
  office?: IOffice; 
}


export interface ICreateRecord {
  userId: string;
  masterId: string;
  serviceId: string;
  officeId: string;
  date: Date;
}

export interface IUpdateRecord extends ICreateRecord {
  id: string;
}

export interface TResGetRecord {
  rows: IRecord[];
  infoPage: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
}
