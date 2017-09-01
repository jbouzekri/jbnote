import { Injectable } from '@angular/core';
import { ConfigStorageInterface } from './config-storage.interface';
import { LoggerService } from './logger.service';

const SYNC_ENABLED_KEY = 'app_sync_enabled';
const SYNC_CONFIG_KEY = 'app_sync_config';

@Injectable()
export class ConfigLocalStorageService implements ConfigStorageInterface {

  constructor(private logger: LoggerService) {
    this.logger.debug('ConfigLocalStorageService instanciated');
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

  setSyncEnabled(syncEnabled: boolean): ConfigStorageInterface {
    localStorage.setItem(SYNC_ENABLED_KEY, (syncEnabled) ? '1' : '0');
    return this;
  }

  hasConfig(): boolean {
    return localStorage.getItem(SYNC_CONFIG_KEY) !== null;
  }

  getConfig(): object {
    return JSON.parse(localStorage.getItem(SYNC_CONFIG_KEY));
  }

  setConfig(config: object): ConfigStorageInterface {
    localStorage.setItem(SYNC_CONFIG_KEY, JSON.stringify(config));
    return this;
  }
}
