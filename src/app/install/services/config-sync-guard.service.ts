import { Inject, Injectable, Optional } from '@angular/core';
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
