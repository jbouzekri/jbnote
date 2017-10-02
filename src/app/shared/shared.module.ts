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
    MatSidenavModule
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
    MatSidenavModule
  ],
})
export class SharedModule { }
