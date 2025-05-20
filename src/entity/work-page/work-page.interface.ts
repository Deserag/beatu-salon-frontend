export interface IResTablePage<T> {
  rows: T[];
  infoPage: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface IReqPage {
  page: number;
  pageSize: number;
  name?: string;
}
