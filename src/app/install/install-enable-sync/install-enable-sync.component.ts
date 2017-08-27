import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigStorageInterface } from '../../shared/config-storage.interface';
import { InstallStepComponentInterface } from '../install-step-component.interface';

@Component({
  selector: 'app-install-enable-sync',
  templateUrl: './install-enable-sync.component.html',
  styleUrls: ['./install-enable-sync.component.css']
})
export class InstallEnableSyncComponent implements OnInit, InstallStepComponentInterface {
  step = 0;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    @Inject('ConfigStorageInterface') protected config: ConfigStorageInterface) {
  }

  ngOnInit() {
  }

  enableSync() {
    this.config.setSyncEnabled(true);
    this.router.navigate(['../', 'step2-config-sync'], { relativeTo: this.route });
  }

  disableSync() {
    this.config.setSyncEnabled(false);
    this.router.navigate(['/notes']);
  }

}
