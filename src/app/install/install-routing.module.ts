import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InstallComponent } from './install.component';
import { InstallEnableSyncComponent } from './install-enable-sync/install-enable-sync.component';
import { InstallConfigSyncComponent } from './install-config-sync/install-config-sync.component';
import { ConfigSyncGuardService } from './services/config-sync-guard.service';

const routes: Routes = [
  {
    path: '',
    component: InstallComponent,
    children: [
      { path: 'step1-enable-sync', component: InstallEnableSyncComponent },
      {
        path: 'step2-config-sync',
        canActivate: [ConfigSyncGuardService],
        component: InstallConfigSyncComponent
      },
      { path: '', redirectTo: 'step1-enable-sync', pathMatch: 'full' },
      { path: '**', redirectTo: 'step1-enable-sync' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ConfigSyncGuardService]
})
export class InstallRoutingModule { }
