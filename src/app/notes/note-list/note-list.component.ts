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
    this.loadList();
  }

  loadList() {
    this.notesService.list().first().subscribe((notes) => {
      this.notes = notes;
    });
  }

  deleteNote(note: Note) {
    if (!confirm(`Are you sure you want to delete the note "${note.title}"`)) {
      return;
    }

    this.notesService.delete(note).first().subscribe(() => {
      // TODO : notification
      this.loadList();
    });
  }
}
