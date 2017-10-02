import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NoConflictStyleCompatibilityMode,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatStepperModule,
  MatInputModule,
  MatSlideToggleModule,
  MatCardModule,
  MatSidenavModule
} from '@angular/material';
import { MarkdownToHtmlModule } from 'ng2-markdown-to-html';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NoConflictStyleCompatibilityMode,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatStepperModule,
    MatInputModule,
    MatSlideToggleModule,
    MatCardModule,
    MatSidenavModule,
    MarkdownToHtmlModule.forRoot()
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    NoConflictStyleCompatibilityMode,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatStepperModule,
    MatInputModule,
    MatSlideToggleModule,
    MatCardModule,
    MatSidenavModule,
    MarkdownToHtmlModule
  ],
})
export class SharedModule { }
