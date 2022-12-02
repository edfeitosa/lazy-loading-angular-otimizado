import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

import { AutocompleteComponent } from './autocomplete.component';

@NgModule({
  declarations: [
    AutocompleteComponent
  ],
  imports: [
    CommonModule,
    AutocompleteLibModule
  ]
})
export class AutocompleteModule {
  static componentToRender = () => AutocompleteComponent;
}
