import { Note } from './note.model';

export const SOURCE_LOCAL = 'local';

export const SOURCE_REMOTE = 'remote';

export class NoteEvent {
  constructor(
    public source: string,
    public action: string,
    public data: Note
  ) {}
}
