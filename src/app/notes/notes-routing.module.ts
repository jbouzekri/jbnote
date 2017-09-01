import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoteListComponent } from './note-list/note-list.component';
import { NoteFormComponent } from './note-form/note-form.component';
import { NoteDetailComponent } from './note-detail/note-detail.component';
import { NotesGuardService } from './services/notes-guard.service';

const routes: Routes = [
  {
    path: '',
    canActivate: [NotesGuardService],
    children: [
      {
        path: 'new',
        component: NoteFormComponent
      },
      {
        path: ':id/edit',
        component: NoteFormComponent
      },
      {
        path: ':id',
        component: NoteDetailComponent
      },
      {
        path: '',
        component: NoteListComponent,
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
