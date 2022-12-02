import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MensagensComponent } from './mensagens.component';

@NgModule({
  declarations: [
    MensagensComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MensagensModule {
  static componentToRender = () => MensagensComponent;
}
