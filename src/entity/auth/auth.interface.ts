export interface IReqAuthLogin {
  login: string;
  password: string;
  deviceId: string;
}

export interface IResAuthLogin {
  accessToken: string;
  user: IResAuthUserInfo;
}

export enum EAuthKeys {
  TOKEN = 'accessToken',
  DEVICE_ID = 'deviceId',
  USER = 'user',
}

export interface IResAuthUserInfo {
  id: string;
  login: string;
  username: string | null;
  roles: ERoles | ERoles[];
  updatedAt?: string;
}

export enum ERoles {
  REGULAR_USER = 'REGULAR_USER',
  ADMIN = 'Admin',
  SUPER_ADMIN = 'SuperAdmin',
}

export const ROLES_ARRAY: ERoles[] = Object.values(ERoles) as ERoles[];
