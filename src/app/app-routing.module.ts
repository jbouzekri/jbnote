/**
 * Root routing module
 *
 * @module app/app-routing.module
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { environment } from '../environments/environment';

import { IndexedDBGuard } from './shared/indexeddb-guard.service';
import { ErrorComponent } from './error/error.component';


// Main routing for the app
// App is globally guard in case of indexeddb is not supported in environment
// Then per default it redirects to /notes (list of saved notes)
// However, if the guard on this notes detect that the app is not yet configured
// It redirects the user back to /install until he finishes the installation
//
// Note that the install and notes module are lazy loaded
const routes: Routes = [
  {
    path: 'error/:errorType',
    component: ErrorComponent
  },
  {
    path: '',
    canActivate: [IndexedDBGuard],
    children: [
      {
        path: 'install',
        loadChildren: 'app/install/install.module#InstallModule',
      },
      {
        path: 'notes',
        loadChildren: 'app/notes/notes.module#NotesModule',
      },
      {
        path: '',
        redirectTo: '/notes',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: environment.isDetail })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
