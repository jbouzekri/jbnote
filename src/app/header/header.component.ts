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

  syncEnabled: boolean;
  syncConfigured: boolean;
  syncError = false;

  onConfChange: Subscription;

  onSyncErrorChange: Subscription;

  constructor(
    private logger: LoggerService,
    private config: ConfigStorageService,
    private syncStatus: SyncStatusService
  ) {
    this.logger.debug('HeaderComponent instanced');
  }

  ngOnInit() {
    this.onConfChange = this.config.confChanged.subscribe(() => {
      this.updateSyncStatus(this.syncError);
    });

    this.onSyncErrorChange = this.syncStatus.syncError.subscribe((error) => {
      this.updateSyncStatus(error);
    });
  }

  protected updateSyncStatus(error: boolean) {
    this.syncEnabled = this.config.isSyncEnabled();
    this.syncConfigured = this.config.hasConfig();
    this.syncError = error;
  }

  ngOnDestroy() {
    if (this.onConfChange) {
      this.onConfChange.unsubscribe();
    }

    if (this.onSyncErrorChange) {
      this.onSyncErrorChange.unsubscribe();
    }
  }
}
