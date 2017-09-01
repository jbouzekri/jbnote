/**
 * An interface for service to store the configuration
 *
 * @module app/shared/config-storage.interface
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

/**
 * Interface to store configuration
 * Useful because we most probably will have different implementation
 * - localStorage in web browser
 * - something else in chrome extension or mobile app
 */
export interface ConfigStorageInterface {
  isInstalled(): boolean;

  hasSyncEnabled(): boolean;

  isSyncEnabled(): boolean;

  setSyncEnabled(syncEnabled: boolean): ConfigStorageInterface;

  hasConfig(): boolean;

  getConfig(): object;

  setConfig(config: object): ConfigStorageInterface;
}
