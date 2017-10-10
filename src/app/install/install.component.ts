/**
 * Install module root component
 * Display the stepper with the install steps
 *
 * @module app/install/install.component
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatStepper } from '@angular/material';

import { LoggerService } from '../shared/logger.service';


@Component({
  selector: 'app-install',
  templateUrl: './install.component.html',
  styleUrls: ['./install.component.css']
})
export class InstallComponent {

  enableSyncFormControl: FormControl; // FormControl for enable sync md-step

  configSyncFormControl: FormControl; // FormControl for config sync md-step

  @ViewChild('stepper')
  stepper: MatStepper; // Reference to stepper to trigger navigation from code

  constructor(
    private router: Router,
    private logger: LoggerService
  ) {
    this.logger.debug('InstallComponent instanced');
    this.createForms();
  }

  /**
   * Create the different formControl used to manipulate the stepper
   */
  protected createForms() {
    this.enableSyncFormControl = new FormControl();
    this.enableSyncFormControl.setErrors({step: false});

    this.configSyncFormControl = new FormControl();
    this.configSyncFormControl.setErrors({step: false});
  }

  /**
   * Called when a new syncStatus event is emitted from child component enable-sync
   * If new state is "sync enabled", we :
   *   - reset the enableSyncFormControl to allow going to next step
   *   - go to next step (config sync)
   * If new state disables sync, we:
   *   - end the install process
   *   - redirect to the note part of the app without sync
   *
   * @param {boolean} newSyncStatus
   */
  onSyncStatusChange(newSyncStatus: boolean) {
    if (newSyncStatus) {
      this.enableSyncFormControl.reset();
      this.stepper.next();
    } else {
      this.router.navigate(['/notes']);
    }
    return;
  }

  /**
   * Executed when config-sync child component informs us that sync is configured
   * It redirects to notes app
   */
  onConfigSubmit() {
    this.router.navigate(['/notes']);
  }

  /**
   * Executed when config-sync child component informs that customer want to go back
   * to previous step.
   * It :
   *   - resets the form control for current step
   *   - redirects to the previous step
   */
  onConfigCancel() {
    this.configSyncFormControl.setErrors({step: false});
    this.stepper.previous();
  }
}
