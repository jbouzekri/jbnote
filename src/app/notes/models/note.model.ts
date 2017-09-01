/**
 * The model that all stored note must respect
 *
 * @module app/notes/models/note.model
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

export class Note {
  id: string;

  title: string;

  body: string;

  createdAt: Date;

  updatedAt: Date;

  tags: string[];
}
