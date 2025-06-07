import { IOffice } from "../office";
import { IService } from "../services";
import { IUser } from "../user";

export interface IRecord {
  id: string;
  client?: IUser;
  master?: IUser;
  service?: IService;
  office?: IOffice;
  date: Date;
}


export interface ICreateRecord {
  clientId: string;
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
