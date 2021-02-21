import { DatabaseSession } from "./database-session";
import { Connection, EntityManager } from "typeorm";

export class TypeOrmDatabaseSession implements DatabaseSession {
  private entityManager: EntityManager;
  private transactionCommitPromise: (value: void) => void;
  private transactionRejectPromise: () => void;
  private afterTransactionPromise: Promise<void>;

  constructor(
    private readonly dbConnection: Connection,
  ) {
    this.entityManager = this.dbConnection.createEntityManager();
  }

  async transactionStart(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        this.afterTransactionPromise = new Promise<void>(async (afterTransactionResolve) => {
          try {
            await this.dbConnection.transaction(async (entityManager: EntityManager) => {
              this.entityManager = entityManager;
              await new Promise<undefined>((resolveCommitPromise, rejectCommitPromise) => {
                this.transactionCommitPromise = rejectCommitPromise;
                this.transactionRejectPromise = rejectCommitPromise;
                resolve();
              });
            });

            return afterTransactionResolve();
          } catch (err) {
            return afterTransactionResolve();
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  async transactionCommit(): Promise<void> {
    this.transactionCommitPromise();
    this.entityManager = this.dbConnection.createEntityManager();
    return await this.afterTransactionPromise;
  }

  async transactionRollback(): Promise<void> {
    this.transactionRejectPromise();
    this.entityManager = this.dbConnection.createEntityManager();
    return await this.afterTransactionPromise;
  }

  getEntityManager(): EntityManager {
    return this.entityManager;
  }
}
