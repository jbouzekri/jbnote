import { Inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ConfigStorageInterface } from '../../shared/config-storage.interface';
import { LoggerService } from '../../shared/logger.service';

@Injectable()
export class NotesGuardService implements CanActivate {
  constructor(
    protected router: Router,
    @Inject('ConfigStorageInterface') protected config: ConfigStorageInterface,
    protected logger: LoggerService
  ) {}

  canActivate() {
    return this.checkSyncConfig();
  }

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
