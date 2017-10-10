/**
 * Header component
 * Display the header in the app
 *
 * @module app/header/header.component
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { LoggerService } from '../shared/logger.service';
import { ConfigStorageService } from '../shared/config-storage.service';
import { SyncStatusService } from '../shared/sync-status.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  syncEnabled: boolean; // Boolean to track sync activation
  syncConfigured: boolean; // Boolean to track sync configuration
  syncError = false; // Boolean to track sync status

  // rxjs subscription triggered when sync config changes
  onConfChange: Subscription;

  // rxjs subscription triggered when sync error
  onSyncErrorChange: Subscription;

  /**
   * @param {LoggerService} logger
   * @param {ConfigStorageService} config
   * @param {SyncStatusService} syncStatus
   */
  constructor(
    private logger: LoggerService,
    private config: ConfigStorageService,
    private syncStatus: SyncStatusService
  ) {
    this.logger.debug('HeaderComponent instanced');
  }

  /**
   * on component init, it subscribes to :
   * - on configuration changes events
   * - on sync error events
   */
  ngOnInit() {
    this.onConfChange = this.config.confChanged.subscribe(() => {
      this.updateSyncStatus(this.syncError);
    });

    this.onSyncErrorChange = this.syncStatus.syncError.subscribe((error) => {
      this.updateSyncStatus(error);
    });
  }

  /**
   * Update the different boolean tracking sync states
   *
   * @param {boolean} error : set the syncError boolean
   */
  protected updateSyncStatus(error: boolean) {
    this.syncEnabled = this.config.isSyncEnabled();
    this.syncConfigured = this.config.hasConfig();
    this.syncError = error;
  }

  /**
   * on component destroy, unsubscribe from all observables
   */
  ngOnDestroy() {
    if (this.onConfChange) {
      this.onConfChange.unsubscribe();
    }

    if (this.onSyncErrorChange) {
      this.onSyncErrorChange.unsubscribe();
    }
  }
}
