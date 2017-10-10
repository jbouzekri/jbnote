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

  // Observable about the status of sync
  syncError = new EventEmitter<boolean>();

  /**
   * @param {LoggerService} logger
   */
  constructor(private logger: LoggerService) {
    this.logger.debug('SyncStatusService instanced');
  }

  /**
   * Emit sync error event
   */
  emitError() {
    this.syncError.emit(true);
  }

  /**
   * Emit sync success event
   */
  emitSuccess() {
    this.syncError.emit(false);
  }
}
