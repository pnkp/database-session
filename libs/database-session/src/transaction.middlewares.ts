import { Request, Response } from 'express';
import { DatabaseSessionInitializer } from './database/database-session.manager';

export function TransactionMiddleware(
  databaseSessionManager: DatabaseSessionInitializer,
): (req: Request, res: Response, next: () => void) => void {
  return (req: Request, res: Response, next: () => void) => {
    databaseSessionManager.initDatabaseSession();
    next();
  };
}
