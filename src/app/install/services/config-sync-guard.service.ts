/**
 * Route guard to verify that step1 is completed before going to step2 in
 * installation / configuration process
 *
 * @module app/install/services/config-sync-guard.service
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Inject, Injectable } from '@angular/core';

import { CanActivate, Router } from '@angular/router';
import { ConfigStorageInterface } from '../../shared/config-storage.interface';
import { LoggerService } from '../../shared/logger.service';


@Injectable()
export class ConfigSyncGuardService implements CanActivate {
  constructor(
    protected router: Router,
    @Inject('ConfigStorageInterface') protected config: ConfigStorageInterface,
    protected logger: LoggerService
  ) {
    this.logger.debug('ConfigSyncGuardService instanciated');
  }

  canActivate() {
    return this.checkSyncEnabled();
  }

  /**
   * Check if step1 is completed
   * If not, it forces a redirection to step1 of installation process
   *
   * @returns {boolean}
   */
  checkSyncEnabled() {
    // If sync is not enabled, redirect to install page where user can make a choice
    if (this.config.isSyncEnabled()) {
      this.logger.debug('config-sync-guard - sync enabled - continue to sync config');
      return true;
    }

    this.logger.info('config-sync-guard - sync not enabled - redirect to enable sync page');
    this.router.navigate(['/install']);
    return false;
  }
}
