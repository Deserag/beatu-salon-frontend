export interface IReqAuthLogin {
  login: string;
  password: string;
  deviceId: string;

}

export interface IResAuthLogin {
  data: {
    access: string; 
    refresh: string; 
  };
  meta: {
    success: boolean; 
  };
}


export enum EAuthKeys {
  TOKEN = 'accessToken',
  DEVICE_ID = 'deviceId',
}


export interface IResAuthUserInfo {
  id: string;
  login: string;
  username: string | null;
  roles: ERoles;
  updatedAt: string;
}

export enum ERoles {
  REGULAR_USER = 'REGULAR_USER',
  ADMIN = 'ADMIN',
}

export const ROLES_ARRAY: ERoles[] = Object.values(ERoles) as ERoles[];