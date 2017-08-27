import { Component, OnInit } from '@angular/core';
import { InstallStepComponentInterface } from './install-step-component.interface';

@Component({
  selector: 'app-install',
  templateUrl: './install.component.html',
  styleUrls: ['./install.component.css']
})
export class InstallComponent implements OnInit {
  step = 0;

  constructor() { }

  ngOnInit() {
  }

  onActivate(component: InstallStepComponentInterface) {
    this.step = component.step;
  }
}
