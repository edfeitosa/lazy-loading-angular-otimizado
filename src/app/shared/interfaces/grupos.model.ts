import { BaseResourceModel } from './base-resource.model';

export class Grupo extends BaseResourceModel {
  constructor(
    public id?: string,
    public codigo?: string,
    public descricao?: string
  ) { super(); }
}