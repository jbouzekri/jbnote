import { ConfigStorageService } from '../app/shared/config-storage.service';
import { LoggerService } from '../app/shared/logger.service';
import { SyncStatusService } from '../app/shared/sync-status.service';
import { Subject } from 'rxjs/Subject';

class ConfigStorageStubService {
  confChanged = new Subject();

  getConfig() {
    return null;
  }
}

class LoggerStubService {
  noop = () => {};

  get debug() {
    return this.noop;
  }

  get error() {
    return this.noop;
  }

  get log() {
    return this.noop;
  }

  get info() {
    return this.noop;
  }

  get warn() {
    return this.noop;
  }
}

class SyncStatusSubService {
  syncError = new Subject();
}

export const SHARED_PROVIDERS = [
  { provide: ConfigStorageService, useClass: ConfigStorageStubService },
  { provide: LoggerService, useClass: LoggerStubService },
  { provide: SyncStatusService, useClass: SyncStatusSubService }
];
