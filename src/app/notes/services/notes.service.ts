import { Injectable } from '@angular/core';
import { LoggerService } from '../../shared/logger.service';
import { Note } from '../models/note.model';
import { SOURCE_LOCAL } from '../models/note-event.model';
import { IndexeddbStorageService } from './storage/indexeddb-storage.service';
import { Observable } from 'rxjs/Observable';
import { SearchEngineStorageService } from './storage/searchengine-storage.service';

@Injectable()
export class NotesService {
  constructor(
    private logger: LoggerService,
    private db: IndexeddbStorageService,
    private searchEngine: SearchEngineStorageService
  ) {
    this.logger.debug('NotesService instanciated');
    this.init();
  }

  protected init() {
    this.db.init();
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

  search(terms: string): Observable<Note[]> {
    const searchPromise = this
      .searchEngine
      .search(terms)
      .then(notes => {
        return Promise.all(notes.map(searchRef => {
          return this.db.get(searchRef.ref);
        }));
      });

    return Observable.fromPromise(searchPromise);
  }
}
