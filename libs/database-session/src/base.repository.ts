import { EntityManager, Repository } from "typeorm";
import { EntityTarget } from "typeorm/common/EntityTarget";

export abstract class BaseRepository {
  protected constructor(
    private readonly sessionEntityManager: EntityManager,
  ) {}

  protected getRepository<TEntity>(entity: EntityTarget<TEntity>): Repository<TEntity> {
    return this.sessionEntityManager.getRepository(entity)
  }

  protected getEntityManager(): EntityManager {
    return this.sessionEntityManager;
  }
}
