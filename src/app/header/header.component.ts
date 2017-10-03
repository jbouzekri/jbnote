import { Component, OnInit } from '@angular/core';

import { LoggerService } from '../shared/logger.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  syncEnabled: boolean;
  syncConfigured: boolean;

  constructor(
    private logger: LoggerService
  ) {
    this.logger.debug('HeaderComponent instanced');
  }

  ngOnInit() {
  }

}
