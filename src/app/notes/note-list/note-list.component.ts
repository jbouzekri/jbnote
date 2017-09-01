import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { Note } from '../models/note.model';
import { NotesService } from '../services/notes.service';
import { LoggerService } from '../../shared/logger.service';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent implements OnInit, OnDestroy {
  notes: Note[] = [];

  // Useless formgroup to be able to have a form in the template
  // without importing FormModule as all other forms are made
  // with reactive forms
  searchForm = new FormGroup({})

  private subscription: Subscription;

  private searchTerms = new Subject<string>();
  private submitTerms = new Subject<string>();
  private forceListReload = new Subject<void>();

  constructor(
    private logger: LoggerService,
    private notesService: NotesService
  ) { }

  ngOnInit() {
    this.subscription = this.createSearchObservable()
      .subscribe((notes) => {
        this.logger.info('Search results found', notes);
        this.notes = notes;
      });

    this.searchTerms.next('');
  }

  loadList() {
    this.createLoadListObservable().subscribe((notes) => {
      this.notes = notes;
    });
  }

  createSearchObservable() {
    const termObservables: Observable<string> = Observable.merge(
      this
        .searchTerms
        .debounceTime(300),
      this.submitTerms
    ).distinctUntilChanged();

    const reloadObservable: Observable<string> = this
      .forceListReload
      .switchMap(() => termObservables.last().startWith(''))
      .map(value => {
        console.log(value);
        return value;
      });

    return Observable.merge(termObservables, reloadObservable)
      .map(term => {
        this.logger.debug(`search triggered with term : "${term}"`);
        return term;
      })
      .switchMap(term => term
            ? this.notesService.search(term)
            : this.createLoadListObservable()
      ).catch(error => {
        // TODO: notification
        this.logger.error('Error when searching notes', error);
        return this.createLoadListObservable();
      });
  }

  createLoadListObservable(): Observable<Note[]> {
    return this.notesService.list().first();
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
      this.forceListReload.next();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
