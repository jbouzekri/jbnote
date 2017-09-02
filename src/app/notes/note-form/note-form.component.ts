/**
 * Component to display the form to create a new note or edit an existing one
 * Note : it used the route params to detect in which case we are in
 *
 * @module app/notes/note-form/note-form.component
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NotesService } from '../services/notes.service';
import { LoggerService } from '../../shared/logger.service';


@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.css']
})
export class NoteFormComponent implements OnInit {

  noteForm: FormGroup; // The form group to create / edit a note

  constructor(
    private logger: LoggerService,
    private fb: FormBuilder,
    private notesService: NotesService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.logger.debug('NoteFormComponent instanced');
    this.createForm();
  }

  /**
   * Manage the case of a note id in the route
   * If one, load the note for editing
   * Else, display an empty form for creation
   */
  ngOnInit() {
    this.loadNote();
  }

  /**
   * Check the route and either load a note for editing and fill the
   * form or display an empty form to create a new note
   */
  loadNote() {
    const noteId = this.route.snapshot.paramMap.get('id');
    if (!noteId) { return; }

    this.notesService.get(noteId).first().subscribe(note => {
      if (!note) {
        // TODO : notification
        return this.router.navigate((['../']));
      }
      this.noteForm.setValue(note);
    });
  }

  /**
   * Instanciate the form group to edit / create a note
   */
  createForm() {
    this.noteForm = this.fb.group({
      id: [null],
      title: [null, [Validators.required]],
      body: [null, [Validators.required]],
      createdAt: [null],
      updatedAt: [null]
    });
  }

  /**
   * Triggered when the form is valid on submit
   * It saves the note and redirects to the list of all notes
   */
  onSubmit() {
    this.notesService.save(this.noteForm.value).first().subscribe(() => {
      return this.router.navigate(['../']);
    });
  }

  // Helper to access the form title field in the template
  get title() { return this.noteForm.get('title'); }

  // Helper to access the form body field in the template
  get body() { return this.noteForm.get('body'); }
}
