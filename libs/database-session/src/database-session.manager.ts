import { ConnectionManager } from 'typeorm';
import { DatabaseSession } from './database-session';
import { composeDatabaseSessionProviderName } from './inject-decorators';
import { TypeOrmDatabaseSession } from './type-orm.database-session';

export class DatabaseSessionManager {
  private databaseSessions: Map<string, DatabaseSession> = new Map<
    string,
    DatabaseSession
  >();

  constructor(connectionManager: ConnectionManager) {
    connectionManager.connections.forEach((connection) => {
      this.databaseSessions.set(
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
    return this.databaseSessions.get(
      composeDatabaseSessionProviderName(connectionName),
    );
  }
}
