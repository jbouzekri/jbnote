/**
 * Component enable-sync (first step of the install process)
 * Display 2 buttons to choose if we want to enable remote sync or not in the app
 *
 * @module app/install/enable-sync/enable-sync.component
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { LoggerService } from '../../shared/logger.service';
import { ConfigStorageService } from '../../shared/config-storage.service';


@Component({
  selector: 'app-enable-sync',
  templateUrl: './enable-sync.component.html'
})
export class EnableSyncComponent {

  @Output()
  syncStatus = new EventEmitter<boolean>(); // Inform parent component of the new sync status

  constructor(
    private config: ConfigStorageService,
    private logger: LoggerService
  ) {
    this.logger.debug('EnableSyncComponent instanced');
  }

  /**
   * Triggered on click on CTA buttons to enable or disable sync in template
   *
   * @param {boolean} newSyncStatus
   */
  changeSyncStatus(newSyncStatus: boolean) {
    this.config.setSyncEnabled(newSyncStatus);
    this.syncStatus.emit(newSyncStatus);
  }
}
