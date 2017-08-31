import { Injectable } from '@angular/core';
import { LoggerService } from '../../shared/logger.service';

@Injectable()
export class NotesService {
  constructor(protected logger: LoggerService) {
    this.logger.debug('NotesService instanciated');
  }
}
