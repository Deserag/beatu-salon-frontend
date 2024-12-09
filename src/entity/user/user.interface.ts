export interface IGetUser {
    users: IUser[];
  }
  
  export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    middleName: string;
    birthDate: string;
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
