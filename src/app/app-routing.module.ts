import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { environment } from '../environments/environment';

const routes: Routes = [
  { path: '',   redirectTo: '/notes', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: !environment.production })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
