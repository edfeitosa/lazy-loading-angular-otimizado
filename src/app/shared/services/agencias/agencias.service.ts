import { Injectable, Injector } from '@angular/core';

import { BaseResource } from '../base-resource.service';
import { Agencias } from '../../interfaces/agencias.model';

@Injectable({
  providedIn: 'any'
})
export class AgenciasService extends BaseResource<Agencias> {

  constructor(protected injector: Injector) {
    super('agencias', injector);
  }
  
}