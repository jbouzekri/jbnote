/**
 * Install module routing
 * (child route)
 *
 * @module app/install/install-routing.module
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InstallComponent } from './install.component';


const routes: Routes = [
  {
    path: '',
    component: InstallComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstallRoutingModule { }
