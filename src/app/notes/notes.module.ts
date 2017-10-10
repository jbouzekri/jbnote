/**
 * Notes module
 * The application module to list/edit/view notes
 *
 * @module app/notes/notes.module
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { Autosize } from 'ng-autosize';

import { SharedModule } from '../shared/shared.module';
import { NoteListComponent } from './note-list/note-list.component';
import { NoteFormComponent } from './note-form/note-form.component';
import { NotesComponent } from './notes.component';
import { NotesService } from './services/notes.service';
import { NotesRoutingModule } from './notes-routing.module';
import { IndexeddbStorageService } from './services/storage/indexeddb-storage.service';
import { SearchEngineStorageService } from './services/storage/searchengine-storage.service';
import { NotesEventBusService } from './services/notes-event-bus.service';
import { FirebaseStorageService } from './services/storage/firebase-storage.service';


@NgModule({
  imports: [
    NotesRoutingModule,
    SharedModule
  ],
  declarations: [
    NoteListComponent,
    NoteFormComponent,
    NotesComponent,
    Autosize
  ],
  providers: [
    NotesService,
    NotesEventBusService,
    IndexeddbStorageService,
    SearchEngineStorageService,
    FirebaseStorageService,
  ]
})
export class NotesModule { }
