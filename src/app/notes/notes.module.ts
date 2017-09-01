/**
 * Notes module
 * The application module to list/edit/view notes
 *
 * @module app/notes/notes.module
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MarkdownToHtmlModule } from 'ng2-markdown-to-html';

import { NoteListComponent } from './note-list/note-list.component';
import { NoteDetailComponent } from './note-detail/note-detail.component';
import { NoteFormComponent } from './note-form/note-form.component';
import { NotesService } from './services/notes.service';
import { NotesRoutingModule } from './notes-routing.module';
import { IndexeddbStorageService } from './services/storage/indexeddb-storage.service';
import { SearchEngineStorageService } from './services/storage/searchengine-storage.service';
import { NotesEventBusService } from './services/notes-event-bus.service';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NotesRoutingModule,
    MarkdownToHtmlModule.forRoot()
  ],
  declarations: [
    NoteListComponent,
    NoteDetailComponent,
    NoteFormComponent
  ],
  providers: [
    NotesService,
    NotesEventBusService,
    IndexeddbStorageService,
    SearchEngineStorageService
  ]
})
export class NotesModule { }
