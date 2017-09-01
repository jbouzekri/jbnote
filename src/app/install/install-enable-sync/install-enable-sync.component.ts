/**
 * Step1 in installation process component
 * User can choose if they want to enable remote synchronization with Firebase
 *
 * @module app/install/install-enable-sync/install-enable-sync.component
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfigStorageInterface } from '../../shared/config-storage.interface';
import { InstallStepComponentInterface } from '../services/install-step-component.interface';


@Component({
  selector: 'app-install-enable-sync',
  templateUrl: './install-enable-sync.component.html',
  styleUrls: ['./install-enable-sync.component.css']
})
export class InstallEnableSyncComponent implements InstallStepComponentInterface {
  step = 0; // 0% (first step) in installation process

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    @Inject('ConfigStorageInterface') protected config: ConfigStorageInterface) {
  }

  /**
   * Triggered on click on CTA "enable remote sync" in template
   * As it says, it enables the remote sync and redirects the user to the configuration
   * page of the Firebase remote sync
   */
  enableSync() {
    this.config.setSyncEnabled(true);
    this.router.navigate(['../', 'step2-config-sync'], { relativeTo: this.route });
  }

  /**
   * Triggered on click on CTA "disable remote sync" in template
   * As it says, it disables the remote sync and starts the notes app locally
   */
  disableSync() {
    this.config.setSyncEnabled(false);
    this.router.navigate(['/notes']);
  }

}
