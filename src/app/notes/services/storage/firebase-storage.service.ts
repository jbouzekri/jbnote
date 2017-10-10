/**
 * Service to manipulate the notes stored in the remote Firebase db
 *
 * @module app/notes/services/storage/firebase-storage.service
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

import { LoggerService } from '../../../shared/logger.service';
import { SyncStatusService } from '../../../shared/sync-status.service';
import { NotesEventBusService } from '../notes-event-bus.service';
import { RemoteStorageService } from './remote-storage.service';
import { ConfigStorageService } from '../../../shared/config-storage.service';
import { NoteEvent } from '../../models/note-event.model';
import { Note } from '../../models/note.model';


@Injectable()
export class FirebaseStorageService extends RemoteStorageService {

  app: firebase.app.App; // The firebase app

  // A promise used to be sure that all queries are done
  // after authentication
  authPromise: Promise<any>;

  /**
   * On instantiation, connects to event bus to potentially
   * updates the remote db with events coming from other sources
   *
   * @param {ConfigStorageService} config
   * @param {NotesEventBusService} eventBus
   * @param {SyncStatusService} syncStatus
   * @param {LoggerService} logger
   */
  constructor(
    private config: ConfigStorageService,
    private eventBus: NotesEventBusService,
    private syncStatus: SyncStatusService,
    private logger: LoggerService
  ) {
    super();

    this.logger.debug('FirebaseStorageService instanced');

    this.watchEvents();
  }

  /**
   * Init the firebase app, authenticate if auth enabled
   * and register listener to remote list events
   *
   * @returns {Promise<void>}
   */
  init(): Promise<void> {
    this.clear();
    if (!this.config.isSyncEnabled()) {
      return Promise.resolve();
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

  /**
   * Register itself as a consumer from the note event bus
   *
   * Note : theorically, the only events it should process are the one from
   * the db to update the remote database
   */
  protected watchEvents() {
    this.eventBus.notes$
      .filter((event: NoteEvent) => {
        return !event.fromRemote && event.targetsRemote;
      }).subscribe((event: NoteEvent) => {
        if (!this.config.isSyncEnabled()) {
          return;
        }

        this.logger.debug('FirebaseStorageService process event', event);
        this.remoteSync(event);
      });
  }

  /**
   * Register events listener on remote db to push events to the note event bus
   * if the remote is updated by another process
   */
  protected watchRemoteEvents() {
    this.authPromise.then(() => {
      const notesRef = this.app.database().ref('/notes');
      notesRef.on('child_added', (data: firebase.database.DataSnapshot) => {
        const note = data.val();
        const eventAction = (note.hasOwnProperty('deletedAt') && note.deletedAt) ? 'delete' : 'refresh';
        this.logger.debug('FirebaseStorageService child_added event', note);
        this.eventBus.emit(new NoteEvent('firebase', eventAction, note));
      });

      notesRef.on('child_changed', (data: firebase.database.DataSnapshot) => {
        const note = data.val();
        const eventAction = (note.hasOwnProperty('deletedAt') && note.deletedAt) ? 'delete' : 'refresh';
        this.logger.debug('FirebaseStorageService child_changed event', note);
        this.eventBus.emit(new NoteEvent('firebase', eventAction, note));
      });

      notesRef.on('child_removed', (data: firebase.database.DataSnapshot) => {
        this.logger.debug('FirebaseStorageService child_removed event', data.val());
        this.eventBus.emit(new NoteEvent('firebase', 'delete', data.val()));
      });

      this.syncStatus.emitSuccess();
    });
  }

  /**
   * If remote auth is enabled in configuration
   * use email and password firebase auth to authenticate
   *
   * Note : always use the authPromise in future requests to
   * be sure they occur after authentication
   *
   * @param config
   */
  protected signIn(config) {
    const authEnabled = config.enableAuth;
    if (authEnabled) {
      const username = config.username;
      const password = config.password;

      this.authPromise = this.app.auth()
        .signInWithEmailAndPassword(username, password)
        .catch(error => {
          this.logger.error('error signing in firebase', error);
          this.syncStatus.emitError();
        });
    } else {
      this.authPromise = Promise.resolve();
    }
  }

  /**
   * Update remote note from a note event
   *
   * @param {NoteEvent} event
   * @returns {firebase.Thenable<any>}
   */
  protected remoteSync(event: NoteEvent) {
    const note = event.data;
    return this.get(note.id).then(remoteData => {
      this.syncStatus.emitSuccess();

      // We update remote if :
      //   - note not found on remote
      //   - or event is a deletion and the deletedAt field is not set on remote
      //   - or if the remote update date is behind the local one
      const remotePush = !remoteData ||
        (event.isDelete && (!remoteData.hasOwnProperty('deletedAt') || !remoteData.deletedAt)) ||
        (!remoteData.hasOwnProperty('updatedAt') || remoteData.updatedAt < note.updatedAt);

      if (remotePush) {
        return this.persist(note);
      }

      return;
    }).catch(error => {
      this.logger.error('error remotesync in firebase', event, error);
      this.syncStatus.emitError();
    });
  }

  /**
   * Get a note from remote by its id
   *
   * @param {string} id
   * @returns {firebase.Promise<Note>}
   */
  protected get(id: string) {
    return this.authPromise.then(() => {
      return this.app.database().ref('/notes/' + id).once('value');
    }).then((snapshot: firebase.database.DataSnapshot) => {
      return <Note>snapshot.val();
    });
  }

  /**
   * Save a note in the remote database
   *
   * @param {Note} note
   * @returns {firebase.Promise<any>}
   */
  protected persist(note: Note) {
    this.logger.debug('FirebaseStorageService persist', note);
    return this.app.database().ref('/notes/' + note.id).set(note);
  }

  /**
   * Clear the firebase app
   */
  protected clear() {
    if (this.authPromise instanceof Promise) {
      this.app.auth().signOut();
    }

    if (this.app) {
      this.app.delete();
    }

    this.app = undefined;
    this.authPromise = undefined;
  }

  /**
   * Called when moving outside the Notes module
   * to be sure that next time we enter this module
   * the call to init recreates a new firebase app
   * with the possibly updated configuration
   */
  destroy() {
    this.clear();
  }
}
