import { Observable } from "rxjs";

export interface ApiRequestFilter {
  field: string;
  value: string;
}

export interface ApiRequestParams {
  filters?: ApiRequestFilter[];
  order?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ApiResponseLinks {
  first: string;
  last: string;
  prev: string;
  next: string;
}

export interface ApiResponseMetaLinks {
  url: string;
  label: string;
  active: boolean;
}

export interface ApiResponseMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: ApiResponseMetaLinks[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T[];
  links: ApiResponseLinks;
  meta: ApiResponseMeta;
}

export interface ApiService<T> {
  getItems(params: ApiRequestParams): Observable<ApiResponse<T>>;
  findByPK(pk: number): Observable<T>;
  createItem(item: T): Observable<T>;
  updateItemByPK(pk: number, item: T): Observable<T>;
  deleteItemByPK(pk: number);
}