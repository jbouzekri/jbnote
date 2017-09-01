import { Note } from './note.model';

export const SOURCE_LOCAL = 'local';

export const SOURCE_REMOTE = 'remote';

export class NoteEvent {
  constructor(
    public source: 'db'|'firebase',
    public action: 'refresh'|'delete',
    public data: Note
  ) {}

  get fromDb () {
    return this.source === 'db';
  }

  get isDelete () {
    return this.action === 'delete';
  }
}
