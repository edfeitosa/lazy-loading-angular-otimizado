import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GruposCarrosComponent } from './grupos-carros.component';

const routes: Routes = [
  { path: '', component: GruposCarrosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GruposCarrosRoutingModule { }