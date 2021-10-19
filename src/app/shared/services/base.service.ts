import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { ApiRequestParams, ApiResponse } from '../types/base-service';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService<T> {

  protected readonly baseUrl = environment.apiUrl + this.getResourceUrl();
  protected httpOptions = this.serializeHttpOptions();

  private _item: BehaviorSubject<T | null> = new BehaviorSubject(null);
  private _items: BehaviorSubject<T[] | null> = new BehaviorSubject(null);

  constructor(protected _http: HttpClient) { }

  abstract getResourceUrl(): string;

  abstract getPrimaryKeyField(): string;

  protected getDefaultHeaders() {
    return {
      'Content-Type': 'application/json'
    };
  }

  /**
   * Getter for item
   */
  get item$(): Observable<T> {
    return this._item.asObservable();
  }

  /**
   * Getter for items
   */
  get items$(): Observable<T[]> {
    return this._items.asObservable();
  }

  getItems(params: ApiRequestParams): Observable<ApiResponse<T>> {
    return this._http.get<ApiResponse<T>>(`${this.baseUrl}/`, this.serializeHttpOptions(params))
      .pipe(
        catchError(this.errorHandler),
        tap((res: ApiResponse<T>) => this._items.next(res.data))
      );
  }

  findByPK(pk: number): Observable<T> {
    return this._items.pipe(
      take(1),
      map((items: T[]) => {
        // Find the item
        const item = items.find(item => item[this.getPrimaryKeyField()] === pk) || null;

        // Update the item
        this._item.next(item);

        // Return the item
        return item;
      }),
      switchMap((item: T) => {

        if (!item) {
          return throwError('Could not found item with PK of ' + pk + '!');
        }

        return of(item);
      })
    );
  }

  getByPK(pk: number): Observable<T> {
    return this._http.get<T>(`${this.baseUrl}/${pk}`)
      .pipe(
        catchError(this.errorHandler),
        tap((item: T) => this._item.next(item)),
        switchMap((item: T) => {

          if (!item) {
            return throwError('Could not found item with PK of ' + pk + '!');
          }
  
          return of(item);
        })
      );
  }

  createItem(data: T): Observable<T> {
    return this.items$.pipe(
      take(1),
      switchMap(items => this._http.post<T>(`${this.baseUrl}/`, data, this.serializeHttpOptions()).pipe(
        map((newItem) => {

          // Update the items with the new item
          this._items.next([newItem, ...items]);

          // Return the new item
          return newItem;
        })
      ))
    );
  }

  updateItemByPK(pk: number, data: T): Observable<T> {   
    return this.items$.pipe(
      take(1),
      switchMap((items: T[]) => this._http.put<T>(`${this.baseUrl}/${pk}/`, data, this.serializeHttpOptions()).pipe(
        map((updatedItem: T) => {
          // Find the index of the updated item
          const index = items.findIndex(item => item[this.getPrimaryKeyField()] === pk);

          // Update the item
          items[index] = updatedItem;

          // Update the items
          this._items.next(items);

          // Return the updated item
          return updatedItem;
        }),
        switchMap((updatedItem: T) => this.item$.pipe(
          take(1),
          filter(item => item && item[this.getPrimaryKeyField()] === pk),
          tap(() => {
            // Update the item if it's selected
            this._item.next(updatedItem);

            // Return the updated item
            return of(updatedItem);
          })
        ))
      ))
    );
  }

  deleteItemByPK(pk: number) {
    return this.items$.pipe(
      take(1),
      switchMap(items => this._http.delete(`${this.baseUrl}/${pk}/`, this.serializeHttpOptions()).pipe(
        map((isDeleted: boolean) => {

          // Find the index of the deleted item
          const index = items.findIndex(item => item[this.getPrimaryKeyField()] === pk);

          // Delete the item
          items.splice(index, 1);

          // Update the items
          this._items.next(items);

          // Return the deleted status
          return isDeleted;
        })
      ))
    );
  }

  protected serializeHttpOptions(params?: ApiRequestParams, headers?: HttpHeaders) {
    return {
      params: params ? this.serializeHttpParams(params) : null,
      headers: headers ? headers : this.serializeHttpHeaders(),
    }
  }

  protected serializeHttpHeaders(): HttpHeaders {
    return new HttpHeaders(this.getDefaultHeaders());
  }

  protected serializeHttpParams(params?: ApiRequestParams): HttpParams {
    let httpParams = new HttpParams();

    if (params.offset != null) {
      httpParams = httpParams.set('offset', params.offset);
    }

    if (params.limit != null) {
      httpParams = httpParams.set('limit', params.limit);
    }

    if (params.search != null) {
      httpParams = httpParams.set('search', params.search);
    }

    if (params.order != null) {
      httpParams = httpParams.set('order', params.order);
    }

    if (params.filters && params.filters.length > 0) {
      params.filters.forEach(filter => {
        httpParams = httpParams.set(filter.field, filter.value);
      });
    }

    return httpParams;
  }

  protected serializeFormData(data: T): FormData {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }

    return formData;
  }

  protected errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}