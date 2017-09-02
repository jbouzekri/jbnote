/**
 * An implementation of the config store using LocalStorage
 *
 * @module app/shared/config-local-storage.service
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Injectable } from '@angular/core';

import { ConfigStorageService } from './config-storage.service';
import { LoggerService } from './logger.service';

const SYNC_ENABLED_KEY = 'app_sync_enabled';
const SYNC_CONFIG_KEY = 'app_sync_config';


@Injectable()
export class ConfigLocalStorageService extends ConfigStorageService {

  constructor(private logger: LoggerService) {
    super();

    this.logger.debug('ConfigLocalStorageService instanced');
    if (!localStorage) {
      throw Error('LocalStorage is not available');
    }
  }

  isInstalled(): boolean {
    return this.hasDisabledSync() || this.hasConfig();
  }

  protected hasDisabledSync(): boolean {
    return this.hasSyncEnabled() && !this.isSyncEnabled();
  }

  hasSyncEnabled(): boolean {
    return localStorage.getItem(SYNC_ENABLED_KEY) !== null;
  }

  isSyncEnabled(): boolean {
    return localStorage.getItem(SYNC_ENABLED_KEY) === '1';
  }

  setSyncEnabled(syncEnabled: boolean): ConfigLocalStorageService {
    localStorage.setItem(SYNC_ENABLED_KEY, (syncEnabled) ? '1' : '0');
    return this;
  }

  hasConfig(): boolean {
    return localStorage.getItem(SYNC_CONFIG_KEY) !== null;
  }

  getConfig(): object {
    return JSON.parse(localStorage.getItem(SYNC_CONFIG_KEY));
  }

  setConfig(config: object): ConfigLocalStorageService {
    localStorage.setItem(SYNC_CONFIG_KEY, JSON.stringify(config));
    return this;
  }
}
