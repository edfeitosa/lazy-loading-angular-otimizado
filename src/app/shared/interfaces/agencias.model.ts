import { BaseResourceModel } from './base-resource.model';

export class Agencias extends BaseResourceModel {
  constructor (
    public id?: string,
    public codigo?: string,
    public nome?: string,
    public codigoPais?: string,
    public nomePais?: string,
    public siglaEstado?: string,
    public nomeCidade?: string,
    public codigoFilial?: string,
    public codigoCentroOperacional?: string
  ) { super(); }
}

