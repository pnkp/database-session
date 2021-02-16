import { BaseRepository } from "../../libs/database-session/src/base.repository";
import { InjectSessionEntityManager } from "../../libs/database-session/src";
import { SessionEntityManager } from "../../libs/database-session/src/session.entity-manager";
import { Injectable } from "@nestjs/common";
import { ExampleModel } from "./example.model";

@Injectable()
export class ExampleRepository extends BaseRepository {
  constructor(
    @InjectSessionEntityManager() sessionEntityManager: SessionEntityManager,
  ) {
    super(sessionEntityManager);
  }

  async save(exampleModel: ExampleModel): Promise<ExampleModel> {
    const repository = this.getRepository(ExampleModel);
    return await repository.save(exampleModel);
  }
}
