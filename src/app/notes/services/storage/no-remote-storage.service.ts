/**
 * Service passed to notesService if the user has chosen to deactivate
 * remote syncing
 *
 * @module app/notes/services/noremote-storage.service
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Injectable } from '@angular/core';

import { LoggerService } from '../../../shared/logger.service';
import { RemoteStorageService } from './remote-storage.service';
import { ConfigStorageService } from '../../../shared/config-storage.service';
import { NotesEventBusService } from '../notes-event-bus.service';

@Injectable()
export class NoRemoteStorageService extends RemoteStorageService {

  constructor(
    private config: ConfigStorageService,
    private eventBus: NotesEventBusService,
    private logger: LoggerService
  ) {
    super();

    this.logger.debug('NoRemoteStorageService instanced');
  }

  init() {
    return Promise.resolve();
  }
}
