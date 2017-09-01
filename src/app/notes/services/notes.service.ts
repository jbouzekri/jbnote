import { Injectable } from '@angular/core';
import { LoggerService } from '../../shared/logger.service';
import { Note } from '../models/note.model';
import { SOURCE_LOCAL } from '../models/note-event.model';
import { IndexeddbStorageService } from './storage/indexeddb-storage.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NotesService {
  constructor(
    protected logger: LoggerService,
    protected db: IndexeddbStorageService
  ) {
    this.logger.debug('NotesService instanciated');
  }

  init() {
    // TODO :
    // - trigger sync
    // - load all indexed db to search engine
  }

  sync() {
    // TODO :
    // - trigger sync from remote to local
    // - decide if we need a sync service
  }

  save(note: Note, source: string = SOURCE_LOCAL): Observable<Note> {
    const savePromise = this.db.save(note);

    return Observable.fromPromise(savePromise);
  }

  delete(note: Note, source: string = SOURCE_LOCAL) {
    const deletePromise = this.db.delete(note);

    return Observable.fromPromise(deletePromise);
  }

  get(id: string): Observable<Note> {
    const getPromise = this.db.get(id);

    return Observable.fromPromise(getPromise);
  }

  list(page: number = 1, limit: number = 15): Observable<Note[]> {
    const listPromise = this.db.list(page, limit);

    return Observable.fromPromise(listPromise);
  }

  search() {
    // TODO :
    // - define search parameters
    // - interact with search engine service
  }
}
