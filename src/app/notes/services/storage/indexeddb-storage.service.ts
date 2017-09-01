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
  NOTE_STORE = 'notes';

  dbPromise: Promise<DB>;

  constructor(protected logger: LoggerService, protected eventBus: NotesEventBusService) {
    this.logger.debug('IndexeddbStorageService instanciated');
    this.dbPromise = this.initDB();
    this.watchEvents();
  }

  protected initDB(): Promise<DB> {
    return idb.open('jbnote', 1, (upgradeDb: UpgradeDB) => {
      if (!upgradeDb.objectStoreNames.contains(this.NOTE_STORE)) {
        const noteStore = upgradeDb.createObjectStore(this.NOTE_STORE, {keyPath: 'id'});
        noteStore.createIndex('updatedAt', 'updatedAt', {unique: false});
      }
    });
  }

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

  public save(note: Note): Promise<Note> {
    if (!note.id) {
      return this.add(note);
    } else {
      return this.update(note);
    }
  }

  public get(id: string): Promise<Note> {
    return this.dbPromise.then((db: DB) => {
      const tx = db.transaction(this.NOTE_STORE, 'readonly');
      const store = tx.objectStore(this.NOTE_STORE);
      return store.get(id);
    });
  }

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

  public delete(note: Note): Promise<Note> {
    return this
      .persist(note, 'delete', (item: Note) => item.id)
      .then((persistedNote) => {
        this.eventBus.emit(new NoteEvent('db', 'delete', persistedNote));
        return persistedNote;
      });
  }

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

  protected update(note: Note): Promise<Note> {
    note.updatedAt = new Date();

    return this
      .persist(note, 'put')
      .then((persistedNote) => {
        this.eventBus.emit(new NoteEvent('db', 'refresh', persistedNote));
        return persistedNote;
      });
  }

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
