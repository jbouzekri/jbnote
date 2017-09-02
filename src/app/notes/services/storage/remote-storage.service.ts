/**
 * An interface for remote storage service
 *
 * @module app/notes/services/remote-storage.service
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

/**
 * Interface to store note in a remote location
 * Useful because user can choose between having remote storage or not
 */
export abstract class RemoteStorageService {
  abstract init(): Promise<void>;
}
