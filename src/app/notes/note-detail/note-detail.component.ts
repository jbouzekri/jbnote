/**
 * Component to display the detail of a note
 *
 * @module app/notes/note-detail/note-detail.component
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NotesService } from '../services/notes.service';
import { Note } from '../models/note.model';
import { LoggerService } from '../../shared/logger.service';


@Component({
  selector: 'app-note-detail',
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.css']
})
export class NoteDetailComponent implements OnInit {
  note: Note;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notesService: NotesService,
    private logger: LoggerService
  ) {
    this.logger.debug('NoteDetailComponent instanced');
  }

  /**
   * On init, load the note to display from the route param
   */
  ngOnInit() {
    this.loadNote();
  }

  /**
   * Load the note from the route param
   */
  loadNote() {
    const noteId = this.route.snapshot.paramMap.get('id');
    if (!noteId) { return; }

    this.notesService.get(noteId).first().subscribe(
      note => {
        if (!note) {
          // TODO : notification
          return this.router.navigate((['../']));
        }

        this.note = note;
      },
      () => {
        // TODO : manage error
      }
    );
  }

  /**
   * Triggered by a click on the delete button
   * It removes the note and redirects to the list of all notes
   */
  deleteNote() {
    if (!confirm(`Are you sure you want to delete the note "${this.note.title}"`)) {
      return;
    }

    this.notesService.remove(this.note).first().subscribe(
      () => {
        // TODO : notification
        return this.router.navigate((['../']));
      },
      () => {
        // TODO : manage error
      }
    );
  }
}
