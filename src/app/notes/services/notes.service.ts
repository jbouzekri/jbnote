/**
 * Core service to access notes from the UI
 * Other services (like search engine, remote, indexeddb) are never accessed directly
 *
 * @module app/notes/services/notes.service
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { LoggerService } from '../../shared/logger.service';
import { Note } from '../models/note.model';
import { SOURCE_LOCAL } from '../models/note-event.model';
import { IndexeddbStorageService } from './storage/indexeddb-storage.service';
import { SearchEngineStorageService } from './storage/searchengine-storage.service';
import { RemoteStorageService } from './storage/remote-storage.service';


@Injectable()
export class NotesService {

  private fullSyncSource = new Subject<string>();

  // An observable used to indicate that a full sync is in progress
  // And which step it is doing right now
  fullSyncStatus$ = this.fullSyncSource.asObservable();

  constructor(
    private logger: LoggerService,
    private db: IndexeddbStorageService,
    private searchEngine: SearchEngineStorageService,
    private remote: RemoteStorageService
  ) {
    this.logger.debug('NotesService instanced');
  }

  init() {
    return this.remote.init().then(() => {
      return this.db.init();
    });
  }

  destroy() {
    return this.remote.destroy();
  }

  save(note: Note): Observable<Note> {
    const savePromise = this.db.save(note);

    return Observable.fromPromise(savePromise);
  }

  remove(note: Note) {
    const deletePromise = this.db.remove(note);

    return Observable.fromPromise(deletePromise);
  }

  /**
   * Get a note by its id
   *
   * @param {string} id
   * @returns {Observable<Note>}
   */
  get(id: string): Observable<Note> {
    const getPromise = this.db.get(id);

    return Observable.fromPromise(getPromise);
  }

  /**
   * List notes by their last update date
   * Supports pagination with page and limit attributes
   * (per default, the last 15 updated notes)
   *
   * @param {number} page
   * @param {number} limit
   * @returns {Observable<Note[]>}
   */
  list(page: number = 1, limit: number = 15): Observable<Note[]> {
    const listPromise = this.db.list(page, limit);

    return Observable.fromPromise(listPromise);
  }

  /**
   * Trigger a search using the fulltext search engine
   *
   * @param {string} terms
   * @returns {Observable<Note[]>}
   */
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
