import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotesService } from '../services/notes.service';
import { Note } from '../models/note.model';

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
    private notesService: NotesService
  ) { }

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

      this.note = note;
    });
  }

  deleteNote() {
    if (!confirm(`Are you sure you want to delete the note "${this.note.title}"`)) {
      return;
    }

    this.notesService.delete(this.note).first().subscribe(() => {
      // TODO : notification
      return this.router.navigate((['../']));
    });
  }
}
