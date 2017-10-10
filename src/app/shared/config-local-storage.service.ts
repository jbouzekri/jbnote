/**
 * An implementation of the config store using LocalStorage
 *
 * @module app/shared/config-local-storage.service
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Injectable } from '@angular/core';

import { ConfigStorageService } from './config-storage.service';
import { ConfigFirebase } from './config-firebase.model';
import { LoggerService } from './logger.service';

const SYNC_ENABLED_KEY = 'app_sync_enabled';
const SYNC_CONFIG_KEY = 'app_sync_config';


@Injectable()
export class ConfigLocalStorageService extends ConfigStorageService {

  /**
   * @param {LoggerService} logger
   */
  constructor(private logger: LoggerService) {
    super();

    this.logger.debug('ConfigLocalStorageService instanced');
    if (!localStorage) {
      throw Error('LocalStorage is not available');
    }
  }

  /**
   * Return true if installation has been completed
   *
   * @returns {boolean}
   */
  isInstalled(): boolean {
    return this.hasDisabledSync() || this.hasConfig();
  }

  /**
   * Check if sync is disabled
   * Note : user has made a real choice to disable sync
   *
   * @returns {boolean}
   */
  protected hasDisabledSync(): boolean {
    return this.hasMadeChoiceOnSync() && !this.isSyncEnabled();
  }

  /**
   * Check if the user has made a choice to enable or disable sync
   *
   * @returns {boolean}
   */
  protected hasMadeChoiceOnSync(): boolean {
    return localStorage.getItem(SYNC_ENABLED_KEY) !== null;
  }

  /**
   * Check if sync is enabled
   *
   * @returns {boolean}
   */
  isSyncEnabled(): boolean {
    return localStorage.getItem(SYNC_ENABLED_KEY) === '1';
  }

  /**
   * Enable/disable sync
   *
   * @param {boolean} syncEnabled
   * @returns {ConfigLocalStorageService}
   */
  setSyncEnabled(syncEnabled: boolean): ConfigLocalStorageService {
    localStorage.setItem(SYNC_ENABLED_KEY, (syncEnabled) ? '1' : '0');
    this.confChanged.emit();
    return this;
  }

  /**
   * Check if sync is configured
   *
   * @returns {boolean}
   */
  hasConfig(): boolean {
    return localStorage.getItem(SYNC_CONFIG_KEY) !== null;
  }

  /**
   * Get sync configuration
   *
   * @returns {ConfigFirebase}
   */
  getConfig(): ConfigFirebase {
    return <ConfigFirebase>JSON.parse(localStorage.getItem(SYNC_CONFIG_KEY));
  }

  /**
   * Save the sync configuration
   *
   * @param {ConfigFirebase} config
   * @returns {ConfigLocalStorageService}
   */
  setConfig(config: ConfigFirebase): ConfigLocalStorageService {
    localStorage.setItem(SYNC_CONFIG_KEY, JSON.stringify(config));
    this.confChanged.emit();
    return this;
  }
}
