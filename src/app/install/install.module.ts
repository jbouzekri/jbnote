/**
 * Install module
 * (Installation is only the configuration of the remote sync with firebase)
 *
 * @module app/install/install-routing.module
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { InstallComponent } from './install.component';
import { InstallRoutingModule } from './install-routing.module';


@NgModule({
  imports: [
    InstallRoutingModule,
    SharedModule
  ],
  declarations: [
    InstallComponent
  ]
})
export class InstallModule { }
