export interface DatabaseSession {
  transactionStart(): Promise<void>;
  transactionCommit(): void;
  transactionRollback(): void;
}
