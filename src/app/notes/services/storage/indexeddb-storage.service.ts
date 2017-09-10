/**
 * Service to manipulate the notes stored in the local indexeddb db
 * (this is the master source of all the data for the app)
 *
 * @module app/notes/services/storage/firebase-storage.service
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
   * On instantiation, open the db and connects to event bus to potentially
   * updates the local db with events coming from other sources
   *
   * @param {LoggerService} logger
   * @param {NotesEventBusService} eventBus
   */
  constructor(private logger: LoggerService, private eventBus: NotesEventBusService) {
    this.logger.debug('IndexeddbStorageService instanced');
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
   * Register itself as a consumer from the note event bus
   *
   * Note : theorically, the only events it should process are the one from
   * the remote (firebase) to update its local database
   */
  protected watchEvents() {
    this.eventBus.notes$
      .filter((event: NoteEvent) => {
        return !event.fromDb && event.targetsDb;
      }).subscribe((event: NoteEvent) => {
        this.logger.debug('IndexeddbStorageService process event', event);
        this.localSync(event);
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
      return this.create(note);
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
   * @param {boolean} indexOnly
   * @returns {Promise<Note>}
   */
  public remove(note: Note, indexOnly = false): Promise<Note> {
    note.deletedAt = (new Date()).getTime();

    return this.clear(note, indexOnly);
  }

  /**
   * Delete a note
   * Idempotent (don't change the note data)
   *
   * Note : named clear instead of delete because of reserved word
   *
   * @param {Note} note
   * @param {boolean} indexOnly
   * @returns {Promise<Note>}
   */
  protected clear(note: Note, indexOnly = false): Promise<Note> {
    return this
      .persist(note, 'delete', (item: Note) => item.id)
      .then((persistedNote) => {
        const eventTarget = indexOnly ? 'searchengine' : null;
        this.eventBus.emit(new NoteEvent('db', 'delete', persistedNote, eventTarget));
        return persistedNote;
      });
  }

  /**
   * Add a new note in the local indexeddb
   * Set note id, createdAt, updatedAt
   *
   * Note :
   * - prefer the use of the public save method
   * - published a refresh event to the event bus for the new note
   *
   * @param {Note} note
   * @param {boolean} indexOnly
   * @returns {Promise<Note>}
   */
  protected create(note: Note, indexOnly = false): Promise<Note> {
    note.id = v1();
    note.createdAt = (new Date()).getTime();
    note.updatedAt = (new Date()).getTime();

    return this.add(note, indexOnly);
  }

  /**
   * Add a new note in the local indexeddb
   * Idempotent (don't change the note data)
   *
   * @param {Note} note
   * @param {boolean} indexOnly
   * @returns {Promise<Note>}
   */
  protected add(note: Note, indexOnly = false): Promise<Note> {
    return this
      .persist(note, 'add')
      .then((persistedNote) => {
        const eventTarget = indexOnly ? 'searchengine' : null;
        this.eventBus.emit(new NoteEvent('db', 'refresh', persistedNote, eventTarget));
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
   * @param {boolean} indexOnly
   * @returns {Promise<Note>}
   */
  protected update(note: Note, indexOnly = false): Promise<Note> {
    note.updatedAt = (new Date()).getTime();

    return this.put(note, indexOnly);
  }

  /**
   * Update an existing note in the local indexeddb
   * Idempotent (don't change the note data)
   *
   * @param {Note} note
   * @param {boolean} indexOnly
   * @returns {Promise<Note>}
   */
  protected put(note: Note, indexOnly = false): Promise<Note> {
    return this
      .persist(note, 'put')
      .then((persistedNote) => {
        const eventTarget = indexOnly ? 'searchengine' : null;
        this.eventBus.emit(new NoteEvent('db', 'refresh', persistedNote, eventTarget));
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

  /**
   * Called to synchronize a local note from a remote event
   *
   * @param {NoteEvent} event
   */
  protected localSync(event: NoteEvent) {
    const remoteNote = event.data;
    let localAction;
    if (event.isDelete || (remoteNote.hasOwnProperty('deletedAt') && remoteNote.deletedAt)) {
      localAction = this.clear(remoteNote, true);
    } else {
      localAction = this.get(remoteNote.id).then(localNote => {
        if (localNote.updatedAt < remoteNote.updatedAt) {
          return this.put(remoteNote, true);
        }
      });
    }
    localAction.catch(error => {
      this.logger.error('IndexeddbStorageService local sync error', event, error);
    });
  }
}
