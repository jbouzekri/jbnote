import { Directive, Component, ElementRef, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';


@Directive({
  selector: '[appZoomImage]',
})
export class ZoomImageDirective {

  constructor(private dialog: MatDialog, private elementRef: ElementRef) { }

  @HostListener('click')
  onClick() {
    this.dialog.open(ZoomImageDialogComponent, {
      data: { src: this.elementRef.nativeElement.getAttribute('src') }
    });
  }
}


@Component({
  selector: 'app-zoom-image-dialog',
  template: `<img [src]="data.src" />`,
  styles: [
    `img {
      width: 100%;
    }`
  ]
})
export class ZoomImageDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

}
