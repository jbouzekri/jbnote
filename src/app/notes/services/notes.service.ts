/**
 * Core service to access notes from the UI
 * Other services (like search engine, remote, indexeddb) are never accessed directly
 *
 * @module app/notes/services/notes.service
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

import { LoggerService } from '../../shared/logger.service';
import { Note } from '../models/note.model';
import { IndexeddbStorageService } from './storage/indexeddb-storage.service';
import { SearchEngineStorageService } from './storage/searchengine-storage.service';
import { FirebaseStorageService } from './storage/firebase-storage.service';


@Injectable()
export class NotesService {

  /**
   * @param {LoggerService} logger
   * @param {IndexeddbStorageService} db
   * @param {SearchEngineStorageService} searchEngine
   * @param {FirebaseStorageService} remote
   */
  constructor(
    private logger: LoggerService,
    private db: IndexeddbStorageService,
    private searchEngine: SearchEngineStorageService,
    private remote: FirebaseStorageService
  ) {
    this.logger.debug('NotesService instanced');
  }

  /**
   * Called when the root notes component is instanciated to
   * init all the databases (remote and local)
   *
   * @returns {Promise<void>}
   */
  init() {
    return this.remote.init().then(() => {
      return this.db.init();
    });
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

  /**
   * Save a note in local database
   * This emits an event that can be processed by the remote database
   *
   * @param {Note} note
   * @returns {Observable<Note>}
   */
  save(note: Note): Observable<Note> {
    const savePromise = this.db.save(note);

    return Observable.fromPromise(savePromise);
  }

  /**
   * Remove a note from local database
   * Local db emits an event that can be processed by the remote database
   * @param {Note} note
   * @returns {Observable<Note>}
   */
  remove(note: Note) {
    const deletePromise = this.db.remove(note);

    return Observable.fromPromise(deletePromise);
  }

  /**
   * Called when the root notes component is destroyed to
   * deconnect from remote mainly
   *
   * @returns {void}
   */
  destroy() {
    return this.remote.destroy();
  }
}
