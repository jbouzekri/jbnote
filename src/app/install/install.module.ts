import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstallComponent } from './install.component';
import { InstallRoutingModule } from './install-routing.module';
import { InstallEnableSyncComponent } from './install-enable-sync/install-enable-sync.component';
import { InstallConfigSyncComponent } from './install-config-sync/install-config-sync.component';

@NgModule({
  imports: [
    CommonModule,
    InstallRoutingModule
  ],
  declarations: [
    InstallComponent,
    InstallEnableSyncComponent,
    InstallConfigSyncComponent
  ]
})
export class InstallModule { }
