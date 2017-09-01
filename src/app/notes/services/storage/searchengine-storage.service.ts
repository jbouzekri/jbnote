import { Injectable } from '@angular/core';

import * as lunr from 'lunr';

import { LoggerService } from '../../../shared/logger.service';
import { NotesEventBusService } from '../notes-event-bus.service';
import { Note } from '../../models/note.model';


@Injectable()
export class SearchEngineStorageService {
  index: lunr.Index;

  constructor(private logger: LoggerService, private eventBus: NotesEventBusService) {
    this.logger.debug('SearchEngineStorageService instanciated');
    this.initIndex();
    this.watchEvents();
  }

  protected initIndex() {
    this.index = lunr(function () {
      this.ref('id');
      this.field('title');
      this.field('body');
    });
  }

  protected watchEvents() {
    this.eventBus.notes$.subscribe((noteEvent) => {
      // Search engine only process events from the DB.
      // DB is master in the relation
      if (!noteEvent.fromDb) {
        this.logger.debug('SearchEngineStorageService ignore event not from db', noteEvent);
        return;
      }

      this.logger.debug('SearchEngineStorageService process event', noteEvent);
      if (noteEvent.isDelete) {
        this.index.remove(noteEvent.data);
      } else {
        this.index.remove(noteEvent.data);
        this.index.add(noteEvent.data);
      }
    });
  }

  search(terms: string): Promise<lunr.IIndexSearchResult[]> {
    return new Promise(resolve => {
      resolve(this.index.search(terms));
    });
  }
}
