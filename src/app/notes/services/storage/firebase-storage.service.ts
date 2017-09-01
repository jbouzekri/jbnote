import { Injectable } from '@angular/core';
import { LoggerService } from '../../../shared/logger.service';

@Injectable()
export class FirebaseStorageService {
  constructor(protected logger: LoggerService) {
    this.logger.debug('FirebaseStorageService instanciated');
  }
}
