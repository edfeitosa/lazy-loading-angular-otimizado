import {
  Directive,
  ElementRef,
  Renderer2,
  HostListener
} from '@angular/core';

@Directive({
  selector: '[destacaInformacao]'
})
export class DestacaInformacaoDirective {

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }
  
  @HostListener('document:click', ['$event'])
  clickInside(item: any) {
    if (this.elementRef.nativeElement.contains(item.target)) {
      this.corLinha('rgba(24, 132, 65, 0.2)');
    } else {
      this.corLinha('#fff');
    }
  }

  private corLinha(color: string): void {
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'background-color',
      color  
    );
  }

}
