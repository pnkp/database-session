import { Injectable } from "@nestjs/common";
import { ExampleModel } from "./example.model";
import { QueryRunner } from "typeorm";
import { DatabaseSession, InjectDatabaseSession, InjectSessionQueryRunner } from "../../../libs/database-session/src";

@Injectable()
export class ExampleRepository {
  constructor(
    @InjectSessionQueryRunner() private readonly queryRunner: QueryRunner,
    @InjectDatabaseSession() private readonly databaseSession: DatabaseSession,
  ) {
  }

  async save(exampleModel: Partial<ExampleModel>): Promise<ExampleModel> {
    const repository = this.databaseSession.getRepository(ExampleModel);
    return await repository.save(exampleModel);
  }
}
