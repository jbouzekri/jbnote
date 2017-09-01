/**
 * Service to manipulate the notes stored in the remote Firebase db
 *
 * @module app/notes/services/firebase-storage.service
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Injectable } from '@angular/core';
import { LoggerService } from '../../../shared/logger.service';

@Injectable()
export class FirebaseStorageService {
  constructor(protected logger: LoggerService) {
    this.logger.debug('FirebaseStorageService instanciated');
  }
}
