import {
  Component,
  OnInit,
  OnDestroy,
  ViewContainerRef,
  ViewChild,
  Compiler
} from '@angular/core';
import { take, takeWhile } from 'rxjs/operators';

import { AgenciasService } from '../../shared/services/agencias/agencias.service';
import { Agencias } from '../../shared/interfaces/agencias.model';

@Component({
  selector: 'app-agencias',
  templateUrl: './agencias.component.html',
  styleUrls: ['./agencias.component.scss'],
  providers: [ AgenciasService ]
})
export class AgenciasComponent implements OnInit, OnDestroy {

  @ViewChild('autocomplete', { read: ViewContainerRef, static: true }) autocomplete: ViewContainerRef;
  @ViewChild('informacoes', { read: ViewContainerRef, static: true }) informacoes: ViewContainerRef;
  @ViewChild('loader', { read: ViewContainerRef, static: true }) loader: ViewContainerRef;
  @ViewChild('mensagem', { read: ViewContainerRef, static: true }) mensagem: ViewContainerRef;

  inscrito: boolean = true;

  constructor(
    private agenciasService: AgenciasService,
    private compiler: Compiler
  ) { }

  ngOnInit(): void {
    this.getAgencias();
    this.loaderRender();
  }

  ngOnDestroy(): void {
    this.inscrito = false;
  }

  getAgencias(): void {
    this.agenciasService.getAll()
      .pipe(take(1))
      .subscribe(
        (dados: any) => {
          this.loader.clear();
          this.autocompleteRender(dados);
        },
        erro => {
          this.loader.clear();
          this.loaderMensagem(`Ocorreu um erro: ${erro.statusText}`);
        }
      )
  }

  getAgencia(id: string): void {
    this.agenciasService.getId(id)
      .pipe(take(1))
      .subscribe(
        (dados: any) => {
          this.loader.clear();
          this.informacoesRender(dados);
        },
        erro => {
          this.loader.clear();
          this.loaderMensagem(`Ocorreu um erro: ${erro.statusText}`);
        }
      )
  }

  private loaderRender(): void {
    import('../../shared/components/loader/loader.module').then(({ LoaderModule }) => {
      const module = this.compiler.compileModuleSync(LoaderModule);
      const ngModule = module.create(this.autocomplete.injector);
      const component = ngModule.componentFactoryResolver.resolveComponentFactory(LoaderModule.componentToRender());
      const ref = this.loader.createComponent(component);
      ref.instance.mensagem = 'Estamos preparando os dados de agências para você';
    });
  }

  private autocompleteRender(dados: Agencias[]): void {
    import('../../shared/components/autocomplete/autocomplete.module').then(({ AutocompleteModule }) => {
      const module = this.compiler.compileModuleSync(AutocompleteModule);
      const ngModule = module.create(this.autocomplete.injector);
      const component = ngModule.componentFactoryResolver.resolveComponentFactory(AutocompleteModule.componentToRender());
      const ref = this.autocomplete.createComponent(component);
      ref.instance.data = dados;
      ref.instance.keyword = 'nome';
      ref.instance.placeholder = 'Selecione a agência para obter informações';
      ref.instance.titulo = 'Nome da Agência';
      ref.instance.aoSelecionar
        .pipe(takeWhile(() => this.inscrito))
        .subscribe(
          (id: string) => this.getAgencia(id),
          erro => console.log('método autocompleteRender -> ', erro)
        );
    });
  }

  private informacoesRender(dados: Agencias, limpar: boolean = true): void {
    limpar && this.informacoes.clear();
    import('../../shared/components/informacoes/informacoes.module').then(({ InformacoesModule }) => {
      const module = this.compiler.compileModuleSync(InformacoesModule);
      const ngModule = module.create(this.informacoes.injector);
      const component = ngModule.componentFactoryResolver.resolveComponentFactory(InformacoesModule.componentToRender());
      const ref = this.informacoes.createComponent(component);
      ref.instance.tipo = 'agencias';
      ref.instance.dados = dados;
    });
  }

  private loaderMensagem(mensagem: string): void {
    import('../../shared/components/mensagens/mensagens.module').then(({ MensagensModule }) => {
      const module = this.compiler.compileModuleSync(MensagensModule);
      const ngModule = module.create(this.autocomplete.injector);
      const component = ngModule.componentFactoryResolver.resolveComponentFactory(MensagensModule.componentToRender());
      const ref = this.loader.createComponent(component);
      ref.instance.mensagem = mensagem;
    });
  }

}
