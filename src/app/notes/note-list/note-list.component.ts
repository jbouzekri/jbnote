/**
 * Component to display the list of notes
 * It provides a single Subject that manage the update of the list based
 * on the search field or an order to refresh the list
 *
 * @module app/notes/note-list/note-list.component
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { Note } from '../models/note.model';
import { NotesService } from '../services/notes.service';
import { LoggerService } from '../../shared/logger.service';


@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent implements OnInit, OnDestroy {
  selectedIndex = null; // Currently selected note in material expansion component
  notes: Note[] = []; // List of notes to display in the template

  // Useless formgroup to be able to have a form in the template
  // without importing FormModule as all other forms are made
  // with reactive forms
  searchForm = new FormGroup({});

  // Base observable subscription to update the list
  private subscription: Subscription;

  // Subject triggered by a key event on the search field
  private searchTerms = new Subject<string>();
  // Subject triggered by submitting the search form
  private submitTerms = new Subject<string>();
  // Subject to force the refresh of the note list
  private forceListReload = new Subject<void>();

  constructor(
    private logger: LoggerService,
    private notesService: NotesService
  ) {
    this.logger.debug('NoteListComponent instanced');
  }

  /**
   * On init, create the observable using all the previous subject and
   * subscribes to it to update the list of notes
   */
  ngOnInit() {
    // Subscribe to the list observable
    this.subscription = this.createObservable()
      .subscribe((notes) => {
        this.logger.info('Search results found', notes);
        this.notes = notes;
      });

    // Force a refresh of the list for initialization
    this.searchTerms.next('');
  }

  /**
   * Create the observable that aggregate all the subjects in this
   * component to update the list in all cases:
   * - on force refresh
   * - on keyup in search form
   * - on search form submit
   *
   * @returns {Observable<Note[]>}
   */
  createObservable() {
    // Merge subjects triggered when acting on search field
    const termObservables: Observable<string> = Observable.merge(
      this
        .searchTerms
        .debounceTime(300),
      this.submitTerms
    ).distinctUntilChanged();

    // Subject triggered on force reload
    // It uses the latest the search term to trigger a search
    const reloadObservable: Observable<string> = this
      .forceListReload
      .switchMap(() => termObservables.last().startWith(''));

    // On a new search term, search form submit or force reload,
    // it uses the last emitted search term to refresh the notes
    // list in the template
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

  /**
   * A new observable that returns a note list sorted
   * by updated date desc limited to a few items
   *
   * @returns {Observable<Note[]>}
   */
  createLoadListObservable(): Observable<Note[]> {
    return this.notesService.list().first();
  }

  /**
   * Triggers a search by pushing a term to the search rx
   * subject
   *
   * @param {KeyboardEvent} event
   * @param {string} terms
   */
  search(event: KeyboardEvent, terms: string) {
    if (event.keyCode === 13) {
      this.submitTerms.next(terms);
    } else {
      this.searchTerms.next(terms);
    }
  }

  /**
   * Called when deleting a note. It deletes the note
   * and force a reload of the list
   *
   * @param {Note} note
   */
  deleteNote(note: Note) {
    if (!confirm(`Are you sure you want to delete the note "${note.title}"`)) {
      return;
    }

    this.notesService.remove(note).first().subscribe(() => {
      // TODO : notification
      this.forceListReload.next();
    });
  }

  /**
   * Triggered on click on an accordion item with a note
   *
   * @param {number} index
   */
  setIndex(index: number) {
    this.selectedIndex = index;
  }

  /**
   * OnDestroy : unsubscribe all streams
   */
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
