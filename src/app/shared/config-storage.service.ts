/**
 * An abstract class for all services to store the configuration
 *
 * @module app/shared/config-storage.service
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { EventEmitter } from '@angular/core';

import { ConfigFirebase } from './config-firebase.model';

/**
 * Abstract class that all configuration store must extend
 *
 * Useful because we most probably will have different implementation
 * - localStorage in web browser
 * - something else in chrome extension or mobile app
 */
export abstract class ConfigStorageService {
  confChanged = new EventEmitter<void>();

  /**
   * Return true if installation has been completed
   *
   * @returns {boolean}
   */
  abstract isInstalled(): boolean;

  /**
   * Check if sync is enabled
   *
   * @returns {boolean}
   */
  abstract isSyncEnabled(): boolean;

  /**
   * Enable/disable sync
   *
   * @param {boolean} syncEnabled
   * @returns {ConfigLocalStorageService}
   */
  abstract setSyncEnabled(syncEnabled: boolean): ConfigStorageService;

  /**
   * Check if sync is configured
   *
   * @returns {boolean}
   */
  abstract hasConfig(): boolean;

  /**
   * Get sync configuration
   *
   * @returns {ConfigFirebase}
   */
  abstract getConfig(): ConfigFirebase;

  /**
   * Save the sync configuration
   *
   * @param {ConfigFirebase} config
   * @returns {ConfigLocalStorageService}
   */
  abstract setConfig(config: ConfigFirebase): ConfigStorageService;
}
