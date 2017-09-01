import { Component, OnInit } from '@angular/core';
import { NotesService } from '../services/notes.service';
import { Note } from '../models/note.model';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent implements OnInit {
  notes: Note[] = [];

  constructor(
    protected notesService: NotesService
  ) { }

  ngOnInit() {
    this.notesService.list().subscribe((notes) => {
      this.notes = notes;
    });
  }

}
