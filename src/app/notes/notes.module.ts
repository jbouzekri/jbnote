import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoteListComponent } from './note-list/note-list.component';
import { NoteDetailComponent } from './note-detail/note-detail.component';
import { NoteEditComponent } from './note-edit/note-edit.component';
import { NotesComponent } from './notes.component';
import { NotesService } from './services/notes.service';
import { NotesRoutingModule } from './notes-routing.module';

@NgModule({
  imports: [
    CommonModule,
    NotesRoutingModule
  ],
  declarations: [
    NoteListComponent,
    NoteDetailComponent,
    NoteEditComponent,
    NotesComponent
  ],
  providers: [
    NotesService
  ]
})
export class NotesModule { }
