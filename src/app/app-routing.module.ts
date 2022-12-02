import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './modules/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'agencias',
    loadChildren: () => import('./modules/agencias/agencias.module').then(m => m.AgenciasModule)
  },
  {
    path: 'grupos-carros',
    loadChildren: () => import('./modules/grupos-carros/grupos-carros.module').then(m => m.GruposCarrosModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
