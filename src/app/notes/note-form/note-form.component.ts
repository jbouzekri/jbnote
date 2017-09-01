import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotesService } from '../services/notes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.css']
})
export class NoteFormComponent implements OnInit {
  noteForm: FormGroup;

  constructor(
    protected fb: FormBuilder,
    protected notesService: NotesService,
    protected router: Router
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.noteForm = this.fb.group({
      title: [null, [Validators.required]],
      body: [null, [Validators.required]]
    });
  }

  onSubmit() {
    this.notesService.save(this.noteForm.value).then(() => {
      return this.router.navigate(['../']);
    });
  }

  get title() { return this.noteForm.get('title'); }

  get body() { return this.noteForm.get('body'); }
}
