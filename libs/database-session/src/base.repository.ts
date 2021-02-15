import { TypeOrmDatabaseSession } from "./type-orm.database-session";
import { EntityManager, Repository } from "typeorm";
import { EntityTarget } from "typeorm/common/EntityTarget";
import { InjectEntityManager } from "@nestjs/typeorm";

export class BaseRepository {
  constructor(
    @InjectEntityManager()
    private readonly databaseSession: TypeOrmDatabaseSession) {
  }

  protected getRepository<TEntity>(entity: EntityTarget<TEntity>): Repository<TEntity> {
    return this.databaseSession.getEntityManager().getRepository(entity)
  }

  protected getEntityManager(): EntityManager {
    return this.databaseSession.getEntityManager();
  }
}
