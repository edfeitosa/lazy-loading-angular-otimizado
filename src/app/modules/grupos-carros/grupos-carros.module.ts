import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GruposCarrosRoutingModule } from './grupos-carros-routing.modules';
import { GruposCarrosComponent } from './grupos-carros.component';

@NgModule({
  declarations: [
    GruposCarrosComponent
  ],
  imports: [
    CommonModule,
    GruposCarrosRoutingModule
  ]
})
export class GruposCarrosModule { }
