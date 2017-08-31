import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotesComponent } from './notes.component';
import { NoteListComponent } from './note-list/note-list.component';
import { NoteEditComponent } from './note-edit/note-edit.component';
import { NoteDetailComponent } from './note-detail/note-detail.component';
import { NotesGuardService } from './services/notes-guard.service';

const routes: Routes = [
  {
    path: '',
    component: NotesComponent,
    canActivate: [NotesGuardService],
    children: [
      {
        path: '',
        component: NoteListComponent,
        children: [
          {
            path: ':id/edit',
            component: NoteEditComponent
          },
          {
            path: ':id',
            component: NoteDetailComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    NotesGuardService
  ]
})
export class NotesRoutingModule { }
