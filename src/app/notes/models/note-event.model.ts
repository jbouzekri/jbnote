/**
 * The model that all note events published into the bus must respect
 *
 * @module app/notes/models/note-event.model
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Note } from './note.model';


export class NoteEvent {

  /**
   * @param {"db" | "firebase"} source
   * @param {"refresh" | "delete" | "index"} action
   * @param {Note} data
   * @param {"db" | "firebase" | "searchengine"} target
   */
  constructor(
    public source: 'db'|'firebase',
    public action: 'refresh'|'delete'|'index',
    public data: Note,
    public target: 'db'|'firebase'|'searchengine' = null
  ) {}

  /**
   * A getter to verify that the event has been published
   * by the indexeddb service
   *
   * @returns {boolean}
   */
  get fromDb () {
    return this.source === 'db';
  }

  /**
   * A getter to verify that the event has been published
   * by the firebase service
   *
   * @returns {boolean}
   */
  get fromRemote () {
    return this.source === 'firebase';
  }

  /**
   * A getter to check if the event is related to the
   * suppression of a note
   *
   * @returns {boolean}
   */
  get isDelete () {
    return this.action === 'delete';
  }

  /**
   * A getter to check if the event can be processed by
   * remote listener
   *
   * @returns {boolean}
   */
  get targetsRemote () {
    return this.target === null || this.target === 'firebase';
  }

  /**
   * A getter to check if the event can be processed by
   * indexeddb listener
   *
   * @returns {boolean}
   */
  get targetsDb () {
    return this.target === null || this.target === 'db';
  }

  /**
   * A getter to check if the event can be processed by
   * search engine listener
   *
   * @returns {boolean}
   */
  get targetsSearchEngine () {
    return this.target === null || this.target === 'searchengine';
  }
}
