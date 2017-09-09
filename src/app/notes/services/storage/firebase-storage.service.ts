/**
 * Service to manipulate the notes stored in the remote Firebase db
 *
 * @module app/notes/services/firebase-storage.service
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

import { LoggerService } from '../../../shared/logger.service';
import { NotesEventBusService } from '../notes-event-bus.service';
import { RemoteStorageService } from './remote-storage.service';
import { ConfigStorageService } from '../../../shared/config-storage.service';
import { NoteEvent } from '../../models/note-event.model';
import { Note } from '../../models/note.model';

@Injectable()
export class FirebaseStorageService extends RemoteStorageService {
  app: firebase.app.App;
  authPromise: firebase.Promise<any>;

  constructor(
    private config: ConfigStorageService,
    private eventBus: NotesEventBusService,
    private logger: LoggerService
  ) {
    super();

    this.logger.debug('FirebaseStorageService instanced');

    this.watchEvents();
  }

  init(): Promise<void> {
    this.delete();
    if (!this.config.isSyncEnabled()) {
      return;
    }

    // Initialize Firebase
    const config = {

    };
    this.app = firebase.initializeApp(config);

    this.authPromise = this
      .app
      .auth()
      .signInWithEmailAndPassword('falseemail', 'falsepassword');

    this.watchRemoteEvents();

    return Promise.resolve();
  }

  watchRemoteEvents() {
    this.authPromise.then(() => {
      const notesRef = this.app.database().ref('/notes');
      notesRef.on('child_added', (data: firebase.database.DataSnapshot) => {
        this.eventBus.emit(new NoteEvent('firebase', 'refresh', data.val()));
      });

      notesRef.on('child_changed', (data: firebase.database.DataSnapshot) => {
        this.eventBus.emit(new NoteEvent('firebase', 'refresh', data.val()));
      });

      notesRef.on('child_removed', (data: firebase.database.DataSnapshot) => {
        this.eventBus.emit(new NoteEvent('firebase', 'delete', data.val()));
      });
    });
  }

  protected get(id) {
    return this.authPromise.then(() => {
      return this.app.database().ref('/notes/' + id).once('value');
    }).then((snapshot: firebase.database.DataSnapshot) => {
      return snapshot.val();
    });
  }

  protected watchEvents() {
    if (!this.config.isSyncEnabled()) {
      return;
    }

    this.eventBus.notes$
      .filter((event: NoteEvent) => {
        return event.fromDb;
      }).subscribe((event: NoteEvent) => {
        this.logger.debug('FirebaseStorageService process event', event);
        this.remoteSync(event);
      });
  }

  protected persist(note: Note) {
    this.logger.debug('FirebaseStorageService persist', note);
    return this.app.database().ref('/notes/' + note.id).set(note);
  }

  protected remoteSync(event: NoteEvent) {
    const note = event.data;
    return this.get(note.id).then(remoteData => {
      const remotePush = !remoteData ||
        (event.isDelete && (!remoteData.hasOwnProperty('deletedAt') || !remoteData.deletedAt)) ||
        (!remoteData.hasOwnProperty('updatedAt') || remoteData.updatedAt < note.updatedAt);

      if (remotePush) {
        return this.persist(note);
      }

      return;
    });
  }

  delete() {
    if (this.authPromise) {
      this.app.auth().signOut();
    }

    if (this.app) {
      this.app.delete();
    }

    this.app = undefined;
    this.authPromise = undefined;
  }
}
