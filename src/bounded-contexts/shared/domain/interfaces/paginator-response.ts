export type PaginatorResponse<T> = {
  data: T[];
  length: number;
  pageIndex: number;
  pageSize: number;
};
