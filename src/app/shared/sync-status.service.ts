/**
 * A service for cross component communication about sync status
 *
 * @module app/shared/sync-status.service
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { EventEmitter, Injectable } from '@angular/core';

import { LoggerService } from './logger.service';


@Injectable()
export class SyncStatusService {

  syncError = new EventEmitter<boolean>();

  constructor(private logger: LoggerService) {
    this.logger.debug('SyncStatusService instanced');
  }

  emitError() {
    this.syncError.emit(true);
  }

  emitSuccess() {
    this.syncError.emit(false);
  }
}
