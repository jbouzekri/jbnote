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
    const firebaseConf = this.config.getConfig();
    this.app = firebase.initializeApp(firebaseConf);

    // Login if auth enabled
    this.signIn(firebaseConf);

    // Watch remote events on child_added
    this.watchRemoteEvents();

    return Promise.resolve();
  }

  protected watchEvents() {
    this.eventBus.notes$
      .filter((event: NoteEvent) => {
        return event.fromDb;
      }).subscribe((event: NoteEvent) => {
        if (!this.config.isSyncEnabled()) {
          return;
        }

        this.logger.debug('FirebaseStorageService process event', event);
        this.remoteSync(event);
      });
  }

  protected watchRemoteEvents() {
    this.authPromise.then(() => {
      const notesRef = this.app.database().ref('/notes');
      notesRef.on('child_added', (data: firebase.database.DataSnapshot) => {
        this.logger.debug('FirebaseStorageService child_added event', data.val());
        this.eventBus.emit(new NoteEvent('firebase', 'refresh', data.val()));
      });

      notesRef.on('child_changed', (data: firebase.database.DataSnapshot) => {
        this.logger.debug('FirebaseStorageService child_changed event', data.val());
        this.eventBus.emit(new NoteEvent('firebase', 'refresh', data.val()));
      });

      notesRef.on('child_removed', (data: firebase.database.DataSnapshot) => {
        this.logger.debug('FirebaseStorageService child_removed event', data.val());
        this.eventBus.emit(new NoteEvent('firebase', 'delete', data.val()));
      });
    });
  }

  protected signIn(config) {
    const authEnabled = config.enableAuth;
    if (authEnabled) {
      const username = config.username;
      const password = config.password;
      this.authPromise = this
        .app
        .auth()
        .signInWithEmailAndPassword(username, password)
        .catch(error => {
          this.logger.error('error signing in firebase', error);
          // TODO : sync state
        });
    } else {
      this.authPromise = Promise.resolve();
    }
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
    }).catch(error => {
      this.logger.error('error remotesync in firebase', event, error);
      // TODO : sync state
    });
  }

  protected get(id) {
    return this.authPromise.then(() => {
      return this.app.database().ref('/notes/' + id).once('value');
    }).then((snapshot: firebase.database.DataSnapshot) => {
      return snapshot.val();
    });
  }

  protected persist(note: Note) {
    this.logger.debug('FirebaseStorageService persist', note);
    return this.app.database().ref('/notes/' + note.id).set(note);
  }

  protected delete() {
    if (this.authPromise instanceof firebase.Promise) {
      this.app.auth().signOut();
    }

    if (this.app) {
      this.app.delete();
    }

    this.app = undefined;
    this.authPromise = undefined;
  }

  destroy() {
    this.delete();
  }
}
