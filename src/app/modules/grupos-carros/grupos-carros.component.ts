import {
  Component,
  OnInit,
  OnDestroy,
  ViewContainerRef,
  ViewChild,
  Compiler
} from '@angular/core';
import { defer, Observable } from 'rxjs';
import { retry, take, takeWhile, tap } from 'rxjs/operators';

import { GruposService } from '../../shared/services/grupos/grupos.service';
import { Grupo } from '../../shared/interfaces/grupos.model';

@Component({
  selector: 'app-grupos-carros',
  templateUrl: './grupos-carros.component.html',
  styleUrls: ['./grupos-carros.component.scss'],
  providers: [ GruposService ]
})
export class GruposCarrosComponent implements OnInit, OnDestroy {

  @ViewChild('autocomplete', { read: ViewContainerRef, static: true }) autocomplete: ViewContainerRef;
  @ViewChild('informacoes', { read: ViewContainerRef, static: true }) informacoes: ViewContainerRef;
  @ViewChild('loader', { read: ViewContainerRef, static: true }) loader: ViewContainerRef;
  @ViewChild('mensagem', { read: ViewContainerRef, static: true }) mensagem: ViewContainerRef;

  inscrito: boolean = true;

  constructor(
    private gruposService: GruposService,
    private compiler: Compiler 
  ) { }

  ngOnInit(): void {
    this.getGruposCarros();
    this.loaderRender();
  }

  ngOnDestroy(): void {
    this.inscrito = false;
  }

  private getGruposCarros(): void {
    this.gruposService.getAll()
      .pipe(take(1))
      .subscribe(
        (dados: any) => {
          this.loader.clear();
          this.autocompleteRender(dados);
        },
        (erro: any) => {
          this.loader.clear();
          this.loaderMensagem(`Ocorreu um erro: ${erro.statusText}`);
        }
      );
  }

  private carregaModulo(modulo: string): Observable<any> {
    return defer(() => import(`../../shared/components/${modulo}/${modulo}.module`)).pipe(take(1), tap(mod => mod));
  }

  private loaderRender(): void {
    this.carregaModulo('loader').pipe(take(1), retry(1))
      .subscribe(
        (modulo: any) => {
          const module = this.compiler.compileModuleSync(modulo.LoaderModule);
          const ngModule = module.create(this.autocomplete.injector);
          const component = ngModule.componentFactoryResolver.resolveComponentFactory(modulo.LoaderModule.componentToRender());
          const ref = this.loader.createComponent(component);
          ref.instance['mensagem'] = 'Estamos preparando os dados de grupos de carros para você';
        },
        (erro: any) => console.log(`Ocorreu um erro: ${erro}`)
      );
  }

  private autocompleteRender(dados: Grupo[]): void {
    this.carregaModulo('autocomplete').pipe(take(1), retry(1))
      .subscribe(
        (modulo: any) => {
          const module = this.compiler.compileModuleSync(modulo.AutocompleteModule);
          const ngModule = module.create(this.autocomplete.injector);
          const component = ngModule.componentFactoryResolver.resolveComponentFactory(modulo.AutocompleteModule.componentToRender());
          const ref = this.autocomplete.createComponent(component);
          ref.instance['data'] = dados;
          ref.instance['keyword'] = 'codigo';
          ref.instance['placeholder'] = 'Selecione o grupo de carros para obter informações';
          ref.instance['titulo'] = 'Grupo de Carros';
          ref.instance['aoSelecionar']
            .pipe(takeWhile(() => this.inscrito))
            .subscribe(
              (dados: any) => this.informacoesRender(dados),
              (error: any) => console.log(`Ocorreu um erro: ${error}`)
            );
        },
        (erro: any) => console.log(`Ocorreu um erro: ${erro}`)
      );
  }

  private informacoesRender(dados: Grupo, limpar: boolean = true): void {
    limpar && this.informacoes.clear();
    this.carregaModulo('informacoes').pipe(take(1), retry(1))
      .subscribe(
        (modulo: any) => {
          const module = this.compiler.compileModuleSync(modulo.InformacoesModule);
          const ngModule = module.create(this.informacoes.injector);
          const component = ngModule.componentFactoryResolver.resolveComponentFactory(modulo.InformacoesModule.componentToRender());
          const ref = this.informacoes.createComponent(component);
          ref.instance['tipo'] = 'grupos-carros';
          ref.instance['dados'] = dados;
        },
        (erro: any) => console.log(`Ocorreu um erro: ${erro}`)
      );
  }

  private loaderMensagem(mensagem: string): void {
    this.carregaModulo('mensagens').pipe(take(1), retry(1))
      .subscribe(
        (modulo: any) => {
          const module = this.compiler.compileModuleSync(modulo.MensagensModule);
          const ngModule = module.create(this.autocomplete.injector);
          const component = ngModule.componentFactoryResolver.resolveComponentFactory(modulo.MensagensModule.componentToRender());
          const ref = this.loader.createComponent(component);
          ref.instance['mensagem'] = mensagem;
        },
        (erro: any) => console.log(`Ocorreu um erro: ${erro}`)
      );
  }

}
