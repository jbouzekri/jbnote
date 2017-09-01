import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { Note } from '../models/note.model';
import { NotesService } from '../services/notes.service';
import { LoggerService } from '../../shared/logger.service';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent implements OnInit, OnDestroy {
  notes: Note[] = [];

  private subscription: Subscription;
  private searchTerms = new Subject<string>();
  private submitTerms = new Subject<string>();

  constructor(
    private logger: LoggerService,
    private notesService: NotesService
  ) { }

  ngOnInit() {
    this.loadList().subscribe((notes) => {
      this.notes = notes;
    });

    this.subscription = this.createSearchObservable()
      .subscribe((notes) => {
        this.logger.info('Search results found', notes);
        this.notes = notes;
      });
  }

  loadList(): Observable<Note[]> {
    return this.notesService.list().first();
  }

  createSearchObservable() {
    return Observable.merge(
      this.searchTerms.debounceTime(300),
      this.submitTerms
    ).distinctUntilChanged()
      .switchMap(term => term
        ? this.notesService.search(term)
        : this.loadList()
      ).catch(error => {
        // TODO: notification
        this.logger.error('Error when searching notes', error);
        return this.loadList();
      });
  }

  search(event: KeyboardEvent, terms: string) {
    if (event.keyCode === 13) {
      this.submitTerms.next(terms);
    } else {
      this.searchTerms.next(terms);
    }
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

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }
}
