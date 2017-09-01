/**
 * Service to manipulate the notes stored in the local search engine
 *
 * @module app/notes/services/searchengine-storage.service
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

import { Injectable } from '@angular/core';

import * as lunr from 'lunr';

import { LoggerService } from '../../../shared/logger.service';
import { NotesEventBusService } from '../notes-event-bus.service';


@Injectable()
export class SearchEngineStorageService {

  index: lunr.Index; // The lunr index

  /**
   * On instanciation, it
   * - creates the lunr search index
   * - register itself as a listener to the event bus
   *
   * @param {LoggerService} logger
   * @param {NotesEventBusService} eventBus
   */
  constructor(private logger: LoggerService, private eventBus: NotesEventBusService) {
    this.logger.debug('SearchEngineStorageService instanciated');
    this.initIndex();
    this.watchEvents();
  }

  /**
   * Create the note search index
   */
  protected initIndex() {
    this.index = lunr(function () {
      this.ref('id');
      this.field('title');
      this.field('body');
    });
  }

  /**
   * Register itself as a consumer from the note event bus
   *
   * Note : only event emitted from the indexeddb-storage service
   * are processed as this base is considered as the master for
   * the local app
   */
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

  /**
   * Trigger a search in the lunr search index
   *
   * @param {string} terms
   * @returns {Promise<lunr.IIndexSearchResult[]>}
   */
  search(terms: string): Promise<lunr.IIndexSearchResult[]> {
    return new Promise(resolve => {
      resolve(this.index.search(terms));
    });
  }
}
