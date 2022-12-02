import { Injectable, Injector } from '@angular/core';

import { BaseResource } from '../base-resource.service';
import { Grupo } from '../../interfaces/grupos.model';

@Injectable({
  providedIn: 'any'
})
export class GruposService extends BaseResource<Grupo> {

  constructor(protected injector: Injector) {
    super('grupos', injector);
  }
  
}