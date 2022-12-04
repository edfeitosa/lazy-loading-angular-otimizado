import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Agencias } from '../../interfaces/agencias.model';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {

  @Input() data: any;
  @Input() keyword: string;
  @Input() placeholder: string;
  @Input() titulo: string;
  @Output() aoSelecionar: EventEmitter<any> = new EventEmitter();
  numero = new Number;

  constructor() { }

  ngOnInit(): void { }

  selectEvent(item: Agencias): void {
    this.aoSelecionar.emit(item);
  }

  onFocused(): void { }

}
