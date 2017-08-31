import { Injectable } from '@angular/core';
import { LoggerService } from '../../shared/logger.service';

@Injectable()
export class IndexeddbStorageService {
  constructor(protected logger: LoggerService) {
    this.logger.debug('IndexeddbStorageService instanciated');
  }
}
