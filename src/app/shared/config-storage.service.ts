/**
 * An abstract class for all services to store the configuration
 *
 * @module app/shared/config-storage.service
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

/**
 * Abstract class that all configuration store must extend
 *
 * Useful because we most probably will have different implementation
 * - localStorage in web browser
 * - something else in chrome extension or mobile app
 */
export abstract class ConfigStorageService {
  abstract isInstalled(): boolean;

  abstract hasSyncEnabled(): boolean;

  abstract isSyncEnabled(): boolean;

  abstract setSyncEnabled(syncEnabled: boolean): ConfigStorageService;

  abstract hasConfig(): boolean;

  abstract getConfig(): object;

  abstract setConfig(config: object): ConfigStorageService;
}
