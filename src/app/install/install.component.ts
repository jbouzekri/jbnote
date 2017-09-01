/**
 * Install module root component
 * Display the title and progress bar in the installation process
 *
 * @module app/install/install.component
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Component } from '@angular/core';

import { InstallStepComponentInterface } from './services/install-step-component.interface';


@Component({
  selector: 'app-install',
  templateUrl: './install.component.html',
  styleUrls: ['./install.component.css']
})
export class InstallComponent {
  // Percentage of progress in the installation process
  // Used to update the progress bar
  step = 0;

  constructor() { }

  /**
   * Based on the currently activated page, it gets the current step
   * and updates the progress bar
   *
   * @param {InstallStepComponentInterface} component
   */
  onActivate(component: InstallStepComponentInterface) {
    this.step = component.step;
  }
}
