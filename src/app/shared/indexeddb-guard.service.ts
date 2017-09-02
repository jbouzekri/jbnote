/**
 * A routing guard to check if IndexedDB is supported
 *
 * @module app/shared/indexeddb-guard.service
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { LoggerService } from './logger.service';


@Injectable()
export class IndexedDBGuard implements CanActivate {
  constructor(private router: Router, private logger: LoggerService) {
    this.logger.debug('IndexedDBGuard instanced');
  }

  canActivate() {
    return this.checkSupportIndexedDb();
  }

  /**
   * Check if indexedDB is available.
   * If not, it redirects to error page
   *
   * @returns {boolean}
   */
  checkSupportIndexedDb() {
    if (!('indexedDB' in window)) {
      this.logger.debug('indexeddb not supported');
      this.router.navigate(['error', 'indexeddb-support']);
      return false;
    }

    this.logger.debug('indexeddb supported');
    return true;
  }
}
