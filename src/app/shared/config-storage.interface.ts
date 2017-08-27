export interface ConfigStorageInterface {
  isInstalled(): boolean;

  hasSyncEnabled(): boolean;

  isSyncEnabled(): boolean;

  setSyncEnabled(syncEnabled: boolean): ConfigStorageInterface;

  hasConfig(): boolean;

  getConfig(): object;

  setConfig(config: object): ConfigStorageInterface;
}
