import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { LoggerService } from './logger.service';

@Injectable()
export class IndexedDBGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private logger: LoggerService) {
    this.logger.debug('IndexedDBGuard instanciated');
  }

  canActivate() {
    return this.checkSupportIndexedDb();
  }

  canActivateChild() {
    return this.checkSupportIndexedDb();
  }

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
