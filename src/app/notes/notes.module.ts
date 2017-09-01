import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NoteListComponent } from './note-list/note-list.component';
import { NoteDetailComponent } from './note-detail/note-detail.component';
import { NoteFormComponent } from './note-form/note-form.component';
import { NotesService } from './services/notes.service';
import { NotesRoutingModule } from './notes-routing.module';
import { IndexeddbStorageService } from './services/storage/indexeddb-storage.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NotesRoutingModule
  ],
  declarations: [
    NoteListComponent,
    NoteDetailComponent,
    NoteFormComponent
  ],
  providers: [
    NotesService,
    IndexeddbStorageService
  ]
})
export class NotesModule { }
