export interface DatabaseSession {
  transactionStart(): Promise<void>;
  transactionCommit(): Promise<void>;
  transactionRollback(): Promise<void>;
}
