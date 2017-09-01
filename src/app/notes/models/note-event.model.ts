/**
 * The model that all note events published into the bus must respect
 *
 * @module app/notes/models/note-event.model
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Note } from './note.model';

export const SOURCE_LOCAL = 'local';

export const SOURCE_REMOTE = 'remote';


export class NoteEvent {

  constructor(
    public source: 'db'|'firebase',
    public action: 'refresh'|'delete',
    public data: Note
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
   * A getter to check if the event is related to the
   * suppression of a note
   *
   * @returns {boolean}
   */
  get isDelete () {
    return this.action === 'delete';
  }
}
