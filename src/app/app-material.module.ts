import { NgModule } from '@angular/core';
import { MdToolbarModule, MdIconModule, MdButtonModule } from '@angular/material';

@NgModule({
  imports: [MdToolbarModule, MdIconModule, MdButtonModule],
  exports: [MdToolbarModule, MdIconModule, MdButtonModule],
})
export class AppMaterialModule { }
