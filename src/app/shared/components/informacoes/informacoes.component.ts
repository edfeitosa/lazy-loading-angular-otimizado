import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-informacoes',
  templateUrl: './informacoes.component.html',
  styleUrls: ['./informacoes.component.scss']
})
export class InformacoesComponent implements OnInit {

  @Input() tipo: string;
  @Input() dados: any;

  constructor() { }

  ngOnInit(): void { }

}
