import { DatabaseSession } from "./database-session";
import { Connection, EntityManager } from "typeorm";

export class TypeOrmDatabaseSession implements DatabaseSession {
  private entityManager: EntityManager;
  private transactionCommitPromise: (value: void) => void;
  private transactionRejectPromise: () => void;

  constructor(
    private readonly dbConnection: Connection,
  ) {
    this.entityManager = this.dbConnection.createEntityManager();
  }

  transactionStart(): Promise<void> {
    return new Promise(async (resolve) => {
      await this.dbConnection.transaction(async (entityManager) => {
        this.entityManager = entityManager;

        await new Promise(
          (transactionCommitResolve, transactionRollbackReject) => {
            this.transactionCommitPromise = transactionCommitResolve;
            this.transactionRejectPromise = transactionRollbackReject;
          },
        );

        return resolve();
      });
    });

  }

  transactionCommit(): void {
    this.transactionCommitPromise();
    this.entityManager = this.dbConnection.createEntityManager();
  }

  transactionRollback(): void {
    this.transactionRejectPromise();
    this.entityManager = this.dbConnection.createEntityManager();
  }

  getEntityManager(): EntityManager {
    return this.entityManager;
  }
}
