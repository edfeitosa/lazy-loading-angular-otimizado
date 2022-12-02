import { Injector } from '@angular/core';
import { Observable, throwError } from "rxjs";
import { catchError, tap, take } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

import { environment } from '../../../environments/environment';
import { BaseResourceModel } from '../interfaces/base-resource.model';

export abstract class BaseResource<T extends BaseResourceModel> {

  protected httpClient: HttpClient;

  constructor (
    protected apiPath: string,
    protected injector: Injector
  ) {
    this.httpClient = injector.get(HttpClient);
  }

  public getAll(): Observable<T> {
    return this.httpClient.get<T>(`${environment.URL_SERVICE}/${this.apiPath}`)
      .pipe(
        take(1),
        tap(dados => dados),
        catchError(erro => throwError(erro))
      )
  }

  public getId(id: string): Observable<T> {
    return this.httpClient.get<T>(`${environment.URL_SERVICE}/${this.apiPath}/${id}`)
      .pipe(
        take(1),
        tap(dados => dados),
        catchError(erro => throwError(erro))
      )
  }

}

