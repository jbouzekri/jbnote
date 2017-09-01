/**
 * Logger service (wrapper around console)
 * Global service injected in almost all other services or component to log
 * messages for debug purposes or in case of errors
 *
 * @module app/shared/logger.service
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

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

  /**
   * Log a debug message to console if log level high enough
   *
   * @returns {Function}
   */
  get debug() {
    if (environment.isDebug) {
      return console.debug.bind(console);
    }
    return this.noop;
  }

  /**
   * Log an error message to console
   *
   * @returns {Function}
   */
  get error() {
    return console.error.bind(console);
  }

  /**
   * Log a message to console if not in production environment
   *
   * @returns {Function}
   */
  get log() {
    if (this.enabled) {
      return console.log.bind(console);
    }
    return this.noop;
  }

  /**
   * Log an info message to console if log level high enough
   *
   * @returns {Function}
   */
  get info() {
    if (environment.isInfo) {
      return console.info.bind(console);
    }
    return this.noop;
  }

  /**
   * Log a warning message to console
   *
   * @returns {Function}
   */
  get warn() {
    return console.warn.bind(console);
  }
}
