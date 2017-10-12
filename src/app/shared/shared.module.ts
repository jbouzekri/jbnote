/**
 * A module to share common modules (mainly material components)
 *
 * @module app/shared/shared.module
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

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
  MatSidenavModule,
  MatExpansionModule,
  MatMenuModule,
  MatTabsModule,
  MatTooltipModule,
  MatDialogModule
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
    MatExpansionModule,
    MatMenuModule,
    MatTabsModule,
    MatTooltipModule,
    MatDialogModule,
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
    MatExpansionModule,
    MatMenuModule,
    MatTabsModule,
    MatTooltipModule,
    MatDialogModule,
    MarkdownToHtmlModule
  ],
})
export class SharedModule { }
