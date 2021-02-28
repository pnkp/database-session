import { Repository } from "typeorm";
import { EntityTarget } from "typeorm/common/EntityTarget";

export interface DatabaseSession {
  transactionStart(): Promise<void>;
  transactionCommit(): Promise<void>;
  transactionRollback(): Promise<void>;
  getRepository<TEntity>(entity: EntityTarget<TEntity>): Repository<TEntity>;
}
