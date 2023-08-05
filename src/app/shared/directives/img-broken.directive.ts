import { Directive, ElementRef, HostListener, Renderer2, inject } from '@angular/core';

@Directive({
  selector: 'img[appImgBroken]',
  standalone: true
})
export class ImgBrokenDirective {
  private readonly imgHost: ElementRef = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  @HostListener('error') public handleError(): void {
    this.renderer.setAttribute(this.imgHost.nativeElement, 'src', 'images/products/default.webp');
  }

}
