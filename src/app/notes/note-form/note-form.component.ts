import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotesService } from '../services/notes.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.css']
})
export class NoteFormComponent implements OnInit {
  noteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notesService: NotesService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.loadNote();
  }

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

  createForm() {
    this.noteForm = this.fb.group({
      id: [null],
      title: [null, [Validators.required]],
      body: [null, [Validators.required]],
      createdAt: [null],
      updatedAt: [null]
    });
  }

  onSubmit() {
    this.notesService.save(this.noteForm.value).first().subscribe(() => {
      return this.router.navigate(['../']);
    });
  }

  get title() { return this.noteForm.get('title'); }

  get body() { return this.noteForm.get('body'); }
}
