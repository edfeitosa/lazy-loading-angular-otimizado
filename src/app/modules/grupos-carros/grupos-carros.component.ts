import {
  Component,
  OnInit,
  OnDestroy,
  ViewContainerRef,
  ViewChild,
  Compiler
} from '@angular/core';
import { defer, Observable, of, throwError } from 'rxjs';
import { catchError, retry, take, takeWhile, tap } from 'rxjs/operators';

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
      .pipe(
        take(1),
        catchError(erro => {
          this.loader.clear();
          this.loaderMensagem(`Ocorreu um erro: ${erro.statusText}`);
          return of();
        })
      )
      .subscribe((dados: any) => {
          this.loader.clear();
          this.autocompleteRender(dados);
        }
      );
  }

  private getGrupoCarros(id: string): void {
    this.gruposService.getId(id)
      .pipe(
        take(1),
        catchError(erro => {
          this.loader.clear();
          this.loaderMensagem(`Ocorreu um erro: ${erro.statusText}`);
          return of();
        })
      )
      .subscribe((dados: any) => {
          this.loader.clear();
          this.informacoesRender(dados);
        }
      );
  }

  private carregaModulo(modulo: string, erro: string): Observable<any> {
    return defer(() => import(modulo)).pipe(
      take(1),
      tap(mod => mod),
      catchError(() => throwError(erro))
    );
  }

  private loaderRender(): void {
    this.carregaModulo(
      '../../shared/components/loader/loader.module',
      'Componente de load não foi carregado. Por favor, recarregue a página'
    ).pipe(
      take(1),
      catchError(erro => {
        alert(`Ocorreu um erro: ${erro}`);
        return of();
      }), 
      retry(3)
    ).subscribe(mod => {
      const module = this.compiler.compileModuleSync(mod.LoaderModule);
      const ngModule = module.create(this.autocomplete.injector);
      const component = ngModule.componentFactoryResolver.resolveComponentFactory(mod.LoaderModule.componentToRender());
      const ref = this.loader.createComponent(component);
      ref.instance['mensagem'] = 'Estamos preparando os dados de grupos de carros para você';
    });
  }

  private autocompleteRender(dados: Grupo[]): void {
    this.carregaModulo(
      '../../shared/components/autocomplete/autocomplete.module',
      'Componente de autocomplete não foi carregado. Por favor, recarregue a página'
    ).pipe(
      take(1),
      catchError(erro => {
        alert(`Ocorreu um erro: ${erro}`);
        return of();
      }), 
      retry(3)
    ).subscribe(mod => {
      const module = this.compiler.compileModuleSync(mod.AutocompleteModule);
      const ngModule = module.create(this.autocomplete.injector);
      const component = ngModule.componentFactoryResolver.resolveComponentFactory(mod.AutocompleteModule.componentToRender());
      const ref = this.autocomplete.createComponent(component);
      ref.instance['data'] = dados;
      ref.instance['keyword'] = 'codigo';
      ref.instance['placeholder'] = 'Selecione o grupo de carros para obter informações';
      ref.instance['titulo'] = 'Grupo de Carros';
      ref.instance['aoSelecionar']
        .pipe(takeWhile(() => this.inscrito))
        .subscribe(
          (id: string) => {
            console.log('identificador -> ', id); 
            this.getGrupoCarros(id)
          }
        );
    });
  }

  private informacoesRender(dados: Grupo, limpar: boolean = true): void {
    limpar && this.informacoes.clear();
    this.carregaModulo(
      '../../shared/components/informacoes/informacoes.module',
      'Componente de informações não foi carregado. Por favor, recarregue a página'
    ).pipe(
      take(1),
      catchError(erro => {
        alert(`Ocorreu um erro: ${erro}`);
        return of();
      }), 
      retry(3)
    ).subscribe(mod => {
      const module = this.compiler.compileModuleSync(mod.InformacoesModule);
      const ngModule = module.create(this.informacoes.injector);
      const component = ngModule.componentFactoryResolver.resolveComponentFactory(mod.InformacoesModule.componentToRender());
      const ref = this.informacoes.createComponent(component);
      ref.instance['tipo'] = 'grupos-carros';
      ref.instance['dados'] = dados;
    });
  }

  private loaderMensagem(mensagem: string): void {
    this.carregaModulo(
      '../../shared/components/mensagens/mensagens.module',
      'Componente de mensagens não foi carregado. Por favor, recarregue a página'
    ).pipe(
      take(1),
      catchError(erro => {
        alert(`Ocorreu um erro: ${erro}`);
        return of();
      }), 
      retry(3)
    ).subscribe(mod => {
      const module = this.compiler.compileModuleSync(mod.MensagensModule);
      const ngModule = module.create(this.autocomplete.injector);
      const component = ngModule.componentFactoryResolver.resolveComponentFactory(mod.MensagensModule.componentToRender());
      const ref = this.loader.createComponent(component);
      ref.instance['mensagem'] = mensagem;
    });
  }

}
