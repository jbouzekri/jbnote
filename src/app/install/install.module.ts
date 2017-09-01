/**
 * Install module
 * (Installation is only the configuration of the remote sync with firebase)
 *
 * @module app/install/install-routing.module
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { InstallComponent } from './install.component';
import { InstallEnableSyncComponent } from './install-enable-sync/install-enable-sync.component';
import { InstallConfigSyncComponent } from './install-config-sync/install-config-sync.component';
import { InstallRoutingModule } from './install-routing.module';


@NgModule({
  imports: [
    CommonModule,
    InstallRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    InstallComponent,
    InstallEnableSyncComponent,
    InstallConfigSyncComponent
  ]
})
export class InstallModule { }
