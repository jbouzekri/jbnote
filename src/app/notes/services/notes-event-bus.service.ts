import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { NoteEvent } from '../models/note-event.model';
import { LoggerService } from '../../shared/logger.service';


@Injectable()
export class NotesEventBusService {
  private notesSource = new Subject<NoteEvent>();

  notes$ = this.notesSource.asObservable();

  constructor(private logger: LoggerService) {
    this.logger.debug('NotesEventBusService instanciated');
  }

  emit(event: NoteEvent) {
    this.logger.debug('NotesEventBusService emitting event', event);
    this.notesSource.next(event);
  }
}
