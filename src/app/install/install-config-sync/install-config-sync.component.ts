import { Component, OnInit } from '@angular/core';
import { InstallStepComponentInterface } from '../install-step-component.interface';

@Component({
  selector: 'app-install-config-sync',
  templateUrl: './install-config-sync.component.html',
  styleUrls: ['./install-config-sync.component.css']
})
export class InstallConfigSyncComponent implements OnInit, InstallStepComponentInterface {
  step = 50;

  constructor() {
  }

  ngOnInit() {
  }
}
