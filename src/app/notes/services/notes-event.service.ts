import { Subject } from 'rxjs/Subject';
import { NoteEvent } from '../models/note-event.model';

class NotesEventsService {
  private notesSource = new Subject<NoteEvent>();

  notes$ = this.notesSource.asObservable();

  emit(event: NoteEvent) {
    this.notesSource.next(event);
  }
}
