import {
  Component,
  OnInit,
  OnDestroy,
  ViewContainerRef,
  ViewChild,
  Compiler
} from '@angular/core';
import { defer, Observable, of } from 'rxjs';
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

  private carregaModuleLoader(): Observable<any> {
    return defer(() => import('../../shared/components/loader/loader.module')).pipe(take(1), tap(mod => mod));
  }

  private loaderRender(): void {
    this.carregaModuleLoader()
      .pipe(
        take(1),
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
    import('../../shared/components/autocomplete/autocomplete.module').then(({ AutocompleteModule }) => {
      const module = this.compiler.compileModuleSync(AutocompleteModule);
      const ngModule = module.create(this.autocomplete.injector);
      const component = ngModule.componentFactoryResolver.resolveComponentFactory(AutocompleteModule.componentToRender());
      const ref = this.autocomplete.createComponent(component);
      ref.instance.data = dados;
      ref.instance.keyword = 'codigo';
      ref.instance.placeholder = 'Selecione o grupo de carros para obter informações';
      ref.instance.titulo = 'Grupo de Carros';
      ref.instance.aoSelecionar
        .pipe(takeWhile(() => this.inscrito))
        .subscribe(
          (id: string) => {
            console.log('identificador -> ', id); 
            this.getGrupoCarros(id)
          },
          erro => console.log('método autocompleteRender -> ', erro)
        );
    });
  }

  private informacoesRender(dados: Grupo, limpar: boolean = true): void {
    limpar && this.informacoes.clear();
    import('../../shared/components/informacoes/informacoes.module').then(({ InformacoesModule }) => {
      const module = this.compiler.compileModuleSync(InformacoesModule);
      const ngModule = module.create(this.informacoes.injector);
      const component = ngModule.componentFactoryResolver.resolveComponentFactory(InformacoesModule.componentToRender());
      const ref = this.informacoes.createComponent(component);
      ref.instance.tipo = 'grupos-carros';
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
