/**
 * Service to share changes events on the note database
 * accross services (like search engine, indexeddb or remote firebase)
 *
 * @module app/notes/services/notes-event-bus.service
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { NoteEvent } from '../models/note-event.model';
import { LoggerService } from '../../shared/logger.service';


@Injectable()
export class NotesEventBusService {
  private notesSource = new Subject<NoteEvent>();

  // The Observable the services that want to be notified of changes
  // needs to subscribe to
  notes$ = this.notesSource.asObservable();

  constructor(private logger: LoggerService) {
    this.logger.debug('NotesEventBusService instanced');
  }

  /**
   * Emit a change to a note to all listening services
   *
   * @param {NoteEvent} event
   */
  emit(event: NoteEvent) {
    this.logger.debug('NotesEventBusService emitting event', event);
    this.notesSource.next(event);
  }
}
