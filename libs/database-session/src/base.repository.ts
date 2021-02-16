import { EntityManager, Repository } from "typeorm";
import { EntityTarget } from "typeorm/common/EntityTarget";
import { SessionEntityManager } from "./session.entity-manager";

export abstract class BaseRepository {
  protected constructor(
    private readonly databaseSession: SessionEntityManager) {
  }

  protected getRepository<TEntity>(entity: EntityTarget<TEntity>): Repository<TEntity> {
    return this.databaseSession.getEntityManager().getRepository(entity)
  }

  protected getEntityManager(): EntityManager {
    return this.databaseSession.getEntityManager();
  }
}
