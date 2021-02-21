import { BaseRepository } from "../../libs/database-session/src/base.repository";
import { InjectSessionEntityManager } from "../../libs/database-session/src";
import { Injectable } from "@nestjs/common";
import { ExampleModel } from "./example.model";
import { EntityManager } from "typeorm";

@Injectable()
export class ExampleRepository extends BaseRepository {
  constructor(
    @InjectSessionEntityManager() sessionEntityManager: EntityManager,
  ) {
    super(sessionEntityManager);
  }

  async save(exampleModel: ExampleModel): Promise<ExampleModel> {
    const repository = this.getRepository(ExampleModel);
    return await repository.save(exampleModel);
  }
}
