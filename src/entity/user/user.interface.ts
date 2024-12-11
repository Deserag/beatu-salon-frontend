import { IResTablePage } from "../work-page";

export interface IGetUser {
    users: IUser[];
  }
  
  export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    middleName: string;
    birthDate: Date;
    department: string;
    createdAt: string;
    updatedAt: string;
    login: string;
    email: string;
    password: string;
    roleId: string;
    telegramId: string | null;
  }
  

export interface IGetUser {
  name: string;
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
}

export interface IGetRole {
  name: string;
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
}

export interface IUserRole {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  creatorId: string;
}

export type TResGetUsers = IResTablePage<IUser>;
export type TResGetRoles = IResTablePage<IUserRole>