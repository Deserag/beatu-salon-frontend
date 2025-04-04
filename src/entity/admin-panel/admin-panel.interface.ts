import { IResTablePage } from "../work-page";
export interface IGetOfficeCongestion {
  
}

export interface IGetRecords {
  
}
export interface IAdminPanel {}
export interface IChartData {
    labels: string[];
    data: number[];
  }
  
export interface IOfficeLoadData {
    labels: string[];
    data: number[];
    colors: string[];
  }

export interface IOrder {
    name: string;
    amount: number;
  }

  export type TResGetOrders = IResTablePage<IOrder>
  export type TResGetOfficeCongestion = IResTablePage<IOfficeLoadData>
  export type TResGetChartData = IResTablePage<IChartData>