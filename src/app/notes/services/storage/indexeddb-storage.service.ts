/**
 * Service to manipulate the notes stored in the local indexeddb db
 * (this is the master source of all the data for the app)
 *
 * @module app/notes/services/firebase-storage.service
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Injectable } from '@angular/core';

import { DB, UpgradeDB } from 'idb';
import { v1 } from 'uuid';

import { LoggerService } from '../../../shared/logger.service';
import { Note } from '../../models/note.model';
import { NotesEventBusService } from '../notes-event-bus.service';
import { NoteEvent } from '../../models/note-event.model';

type NoteFormatter  = (note: Note) => Note|string;


@Injectable()
export class IndexeddbStorageService {
  NOTE_STORE = 'notes'; // Name of the store of notes in indexeddb

  // Store the promise to access the db
  dbPromise: Promise<DB>;

  /**
   * On instanciation, open the db and connects to event bus to potentially
   * updates the local db with events coming from other sources
   *
   * @param {LoggerService} logger
   * @param {NotesEventBusService} eventBus
   */
  constructor(protected logger: LoggerService, protected eventBus: NotesEventBusService) {
    this.logger.debug('IndexeddbStorageService instanciated');
    this.dbPromise = this.initDB();
    this.watchEvents();
  }

  /**
   * Opens the indexeddb
   *
   * @returns {Promise<DB>}
   */
  protected initDB(): Promise<DB> {
    return idb.open('jbnote', 1, (upgradeDb: UpgradeDB) => {
      if (!upgradeDb.objectStoreNames.contains(this.NOTE_STORE)) {
        const noteStore = upgradeDb.createObjectStore(this.NOTE_STORE, {keyPath: 'id'});
        noteStore.createIndex('updatedAt', 'updatedAt', {unique: false});
      }
    });
  }

  /**
   * Trigger a refresh for all remote db based on the local state
   * of the database
   * It loops over all stored notes and push a refresh event to the
   * event bus
   *
   * @returns {Promise<void>}
   */
  public init(): Promise<void> {
    return this.dbPromise.then((db: DB) => {
      const tx = db.transaction(this.NOTE_STORE, 'readonly');
      const store = tx.objectStore(this.NOTE_STORE);
      return store.openCursor();
    }).then(function logItems(cursor) {
      if (!cursor) { return; }
      this.eventBus.emit(new NoteEvent('db', 'refresh', cursor.value));
      return cursor.continue().then(logItems.bind(this));
    }.bind(this)).then(() => {
      return;
    });
  }

  /**
   * Persist a note
   * (intelligent enough to create a new or update an existing note)
   *
   * @param {Note} note
   * @returns {Promise<Note>}
   */
  public save(note: Note): Promise<Note> {
    if (!note.id) {
      return this.add(note);
    } else {
      return this.update(note);
    }
  }

  /**
   * Get a note by its id
   *
   * @param {string} id
   * @returns {Promise<Note>}
   */
  public get(id: string): Promise<Note> {
    return this.dbPromise.then((db: DB) => {
      const tx = db.transaction(this.NOTE_STORE, 'readonly');
      const store = tx.objectStore(this.NOTE_STORE);
      return store.get(id);
    });
  }

  /**
   * List the note (paginated)
   *
   * @param {number} page
   * @param {number} limit
   * @returns {Promise<Note[]>}
   */
  public list(page: number, limit: number): Promise<Note[]> {
    const notesResult = [];
    let noteIndex = 0;

    return this.dbPromise.then((db: DB) => {
      const tx = db.transaction([this.NOTE_STORE], 'readonly');
      const store = tx.objectStore(this.NOTE_STORE);
      const index = store.index('updatedAt');
      return index.openCursor(IDBKeyRange.upperBound(new Date()), 'prev');
    }).then(function showRange(cursor) {
      if (!cursor || notesResult.length >= limit) { return; }
      if (noteIndex >= (page - 1) * limit) {
        notesResult.push(cursor.value);
      }
      noteIndex++;
      return cursor.continue().then(showRange);
    }).then(() => {
      return notesResult;
    });
  }

  /**
   * Delete a note
   * Note : publishes a delete event into the event bus
   *
   * @param {Note} note
   * @returns {Promise<Note>}
   */
  public remove(note: Note): Promise<Note> {
    return this
      .persist(note, 'delete', (item: Note) => item.id)
      .then((persistedNote) => {
        this.eventBus.emit(new NoteEvent('db', 'delete', persistedNote));
        return persistedNote;
      });
  }

  /**
   * Add a new note in the local indexeddb
   *
   * Note :
   * - prefer the use of the public save method
   * - published a refresh event to the event bus for the new note
   *
   * @param {Note} note
   * @returns {Promise<Note>}
   */
  protected add(note: Note): Promise<Note> {
    note.id = v1();
    note.createdAt = new Date();
    note.updatedAt = new Date();

    return this
      .persist(note, 'add')
      .then((persistedNote) => {
        this.eventBus.emit(new NoteEvent('db', 'refresh', persistedNote));
        return persistedNote;
      });
  }

  /**
   * Update an existing note in the local indexeddb
   *
   * Note :
   * - prefer the use of the public save method
   * - published a refresh event to the event bus for the updated note
   *
   * @param {Note} note
   * @returns {Promise<Note>}
   */
  protected update(note: Note): Promise<Note> {
    note.updatedAt = new Date();

    return this
      .persist(note, 'put')
      .then((persistedNote) => {
        this.eventBus.emit(new NoteEvent('db', 'refresh', persistedNote));
        return persistedNote;
      });
  }

  /**
   * Method implementing interaction with the object store
   * to add / update / delete a note
   *
   * @param {Note} note
   * @param {string} method
   * @param {NoteFormatter} format
   * @returns {Promise<Note>}
   */
  protected persist(note: Note, method: string = 'add', format: NoteFormatter = (item: Note) => item) {
    return this.dbPromise.then((db: DB) => {
      const tx = db.transaction(this.NOTE_STORE, 'readwrite');
      const store = tx.objectStore(this.NOTE_STORE);
      store[method](format(note));
      return tx.complete;
    }).then(() => {
      return note;
    });
  }

  protected watchEvents() {
    this.eventBus.notes$.subscribe(() => {}); // TODO : handle event from event bus
  }
}
