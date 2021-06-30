import { DatabaseSession } from './database-session';

export interface DatabaseSessionManager {
  getDatabaseSession(connectionName?: string): DatabaseSession;
}

export interface DatabaseSessionInitializer {
  initDatabaseSession(): void;
}
