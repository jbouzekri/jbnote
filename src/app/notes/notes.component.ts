/**
 * Base component for all child route in the notes
 * On startup it triggers a full syncing then do nothing else
 *
 * @module app/notes/notes.component
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { LoggerService } from '../shared/logger.service';
import { NotesService } from './services/notes.service';


@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html'
})
export class NotesComponent implements OnInit, OnDestroy {

  appReady = false;
  fullSyncStatus: string = null;

  subscription: Subscription;

  constructor(private logger: LoggerService, private notesService: NotesService) {
    this.logger.debug('NotesComponent instanced');

    this.subscription = this
      .notesService
      .fullSyncStatus$
      .subscribe(syncStatus => this.fullSyncStatus = syncStatus);
  }

  ngOnInit() {
    this.notesService.init().then(() => this.appReady = true);
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
    this.notesService.destroy();
  }
}
