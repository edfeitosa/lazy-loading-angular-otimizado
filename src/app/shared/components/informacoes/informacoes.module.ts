import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformacoesComponent } from './informacoes.component';
import { DestacaInformacaoDirective } from '../../directives/destaca-informacao/destaca-informacao.directive';

@NgModule({
  declarations: [
    InformacoesComponent,
    DestacaInformacaoDirective
  ],
  imports: [
    CommonModule
  ]
})
export class InformacoesModule {
  static componentToRender = () => InformacoesComponent;
}
