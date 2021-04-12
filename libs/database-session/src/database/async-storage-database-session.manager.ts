import { ConnectionManager } from 'typeorm';
import { DatabaseSession } from './database-session';
import { composeDatabaseSessionProviderName } from '../inject-decorators';
import { TypeOrmDatabaseSession } from './type-orm.database-session';
import {
  DatabaseSessionInitializer,
  DatabaseSessionManager,
} from './database-session.manager';
import { ConnectionNotEstablishedException } from '../exceptions/connection-not-established.exception';
import { Storage } from '../storage/storage';

export class AsyncStorageDatabaseSessionManager
  implements DatabaseSessionManager, DatabaseSessionInitializer {
  constructor(private readonly connectionManager: ConnectionManager) {}

  initDatabaseSession(): void {
    if (!this.connectionManager.connections.length) {
      throw new ConnectionNotEstablishedException();
    }

    this.connectionManager.connections.forEach((connection) => {
      Storage.set(
        composeDatabaseSessionProviderName(connection.name),
        new TypeOrmDatabaseSession(connection),
      );
    });
  }

  /**
   * Getting instance of DatabaseSession class with given database connection
   * If you do not provide a parameter, you will use the DatabaseSession instance for the "default" database connection
   * @param connectionName
   */
  getDatabaseSession(connectionName?: string): DatabaseSession {
    return Storage.get(composeDatabaseSessionProviderName(connectionName));
  }
}
