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
import { NotesComponent } from './notes.component';
import { FirebaseStorageService } from './services/storage/firebase-storage.service';
import { ConfigStorageService } from '../shared/config-storage.service';
import { RemoteStorageService } from './services/storage/remote-storage.service';
import { LoggerService } from '../shared/logger.service';
import { NoRemoteStorageService } from './services/storage/no-remote-storage.service';
import { SharedModule } from '../shared/shared.module';

export function provideRemoteStorageService(config: ConfigStorageService, eventBus, logger) {
  if (config.isSyncEnabled()) {
    return new FirebaseStorageService(config, eventBus, logger);
  } else {
    return new NoRemoteStorageService(config, eventBus, logger);
  }
}

@NgModule({
  imports: [
    NotesRoutingModule,
    SharedModule
  ],
  declarations: [
    NoteListComponent,
    NoteDetailComponent,
    NoteFormComponent,
    NotesComponent
  ],
  providers: [
    NotesService,
    NotesEventBusService,
    IndexeddbStorageService,
    SearchEngineStorageService,
    {
      provide: RemoteStorageService,
      useFactory: provideRemoteStorageService,
      deps: [ConfigStorageService, NotesEventBusService, LoggerService]
    },
    FirebaseStorageService
  ]
})
export class NotesModule { }
