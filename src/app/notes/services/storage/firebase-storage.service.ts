/**
 * Service to manipulate the notes stored in the remote Firebase db
 *
 * @module app/notes/services/firebase-storage.service
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Injectable } from '@angular/core';

import { LoggerService } from '../../../shared/logger.service';
import { NotesEventBusService } from '../notes-event-bus.service';
import { RemoteStorageService } from './remote-storage.service';
import { ConfigStorageService } from '../../../shared/config-storage.service';

@Injectable()
export class FirebaseStorageService extends RemoteStorageService {
  constructor(
    private config: ConfigStorageService,
    private eventBus: NotesEventBusService,
    private logger: LoggerService
  ) {
    super();

    this.logger.debug('FirebaseStorageService instanced');
    this.watchEvents();
  }

  init() {
    return Promise.resolve();
  }

  watchEvents() {

  }
}
