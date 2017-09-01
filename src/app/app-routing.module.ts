import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { environment } from '../environments/environment';
import { IndexedDBGuard } from './shared/indexeddb-guard.service';
import { ErrorComponent } from './error/error.component';

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
