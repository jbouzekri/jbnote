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

  constructor(private logger: LoggerService, private notesService: NotesService) {
    this.logger.debug('NotesComponent instanced');
  }

  ngOnInit() {
    this.notesService.init().then(() => this.appReady = true);
  }

  ngOnDestroy() {
    this.notesService.destroy();
  }
}
