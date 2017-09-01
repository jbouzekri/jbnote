import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';


@Injectable()
export class LoggerService {
  enabled = !environment.production;
  noop = () => {};

  constructor() {
    if (!console) {
      throw Error('console is not available');
    }
  }

  get debug() {
    if (this.enabled && environment.isDebug) {
      return console.debug.bind(console);
    }
    return this.noop;
  }

  get error() {
    if (this.enabled) {
      return console.error.bind(console);
    }
    return this.noop;
  }

  get log() {
    if (this.enabled) {
      return console.log.bind(console);
    }
    return this.noop;
  }

  get info() {
    if (this.enabled && environment.isInfo) {
      return console.info.bind(console);
    }
    return this.noop;
  }

  get warn() {
    if (this.enabled) {
      return console.warn.bind(console);
    }
    return this.noop;
  }
}
