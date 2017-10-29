import { CommonTools } from './common.po';
import * as firebase from 'firebase';
import { Note } from '../src/app/notes/models/note.model';

export class FirebaseClient {
  app: firebase.app.App;

  signin: Promise<any>;

  constructor() {
    const [ apiKey, authDomain, databaseURL, storageBucket, username, password ] = CommonTools.getFirebaseValidConf(true);
    const firebaseConf = {
      apiKey: apiKey,
      authDomain: authDomain,
      databaseURL: databaseURL,
      storageBucket: storageBucket
    };

    this.app = firebase.initializeApp(firebaseConf);
    this.signin = this.app.auth().signInWithEmailAndPassword(username, password);
  }

  async validate(validationFunc: Function) {
    await this.signin.then(() => {
      return this.app.database().ref('/notes').once('value');
    }).then((snapshot: firebase.database.DataSnapshot) => {
      return snapshot.val();
    }).then(function(notes: {[key: string]: Note}) {
      return validationFunc(notes);
    });
  }

  async createNote(noteId: number|string) {
    await this.signin.then(() => {
      return this.app.database().ref('/notes/' + noteId).set({
        body: 'body ' + noteId,
        createdAt: (new Date()).getTime(),
        id: '' + noteId,
        title: 'title ' + noteId,
        updatedAt: (new Date()).getTime()
      });
    });
  }

  async isReady() {
    await this.signin.then(() => {
      return this.app.database().ref('/notes').remove();
    });
  }

  async destroy() {
    await this.app.auth().signOut().then(() => {
      this.signin = null;
      this.app.delete();
      this.app = null;
    });
  }
}
