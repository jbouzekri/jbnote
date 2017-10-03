/**
 * Install module
 * (Installation is only the configuration of the remote sync with firebase)
 *
 * @module app/install/install-routing.module
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { InstallRoutingModule } from './install-routing.module';

import { InstallComponent } from './install.component';
import { ConfigTutorialComponent } from './config-tutorial/config-tutorial.component';
import { EnableSyncComponent } from './enable-sync/enable-sync.component';
import { ConfigSyncComponent } from './config-sync/config-sync.component';


@NgModule({
  imports: [
    InstallRoutingModule,
    SharedModule
  ],
  declarations: [
    InstallComponent,
    ConfigTutorialComponent,
    EnableSyncComponent,
    ConfigSyncComponent
  ]
})
export class InstallModule { }
