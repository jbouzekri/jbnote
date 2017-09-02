/**
 * Route guard to check if the installation process has been completed
 *
 * @module app/notes/services/notes-guard.service
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { ConfigStorageService } from '../../shared/config-storage.service';
import { LoggerService } from '../../shared/logger.service';


@Injectable()
export class NotesGuardService implements CanActivate {
  constructor(
    private router: Router,
    private config: ConfigStorageService,
    private logger: LoggerService
  ) {}

  canActivate() {
    return this.checkSyncConfig();
  }

  /**
   * Check if the installation process has been completed
   * If yes, continues to the notes module list page
   * If no, redirects to the step1 page in the install module
   *
   * @returns {boolean}
   */
  checkSyncConfig() {
    // If sync was disabled or if it is enabled and configured
    if (this.config.isInstalled()) {
      this.logger.debug('sync-guard - app installed - continue to notes');
      return true;
    }

    this.logger.info('sync-guard - app not installed - redirect to install');
    this.router.navigate(['/install']);
    return false;
  }
}
