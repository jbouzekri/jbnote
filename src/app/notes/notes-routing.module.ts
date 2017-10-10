/**
 * Notes module routing
 * (child route)
 *
 * @module app/notes/notes-routing.module
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoteListComponent } from './note-list/note-list.component';
import { NoteFormComponent } from './note-form/note-form.component';
import { NotesGuardService } from './services/notes-guard.service';
import { NotesComponent } from './notes.component';

// All route are guard to check if the configuration process has been fully
// completed
// If no, we redirect to step1 page of the install module
const routes: Routes = [
  {
    path: '',
    canActivate: [NotesGuardService],
    component: NotesComponent,
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
