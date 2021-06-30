import { DatabaseSessionManager, InjectDatabaseSessionManager } from "../../src";
import { ExampleModel } from './example.model';
import { SECOND_DATABASE_CONNECTION } from './database-session-test.module';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExampleSecondRepository {
  constructor(
    @InjectDatabaseSessionManager()
    private readonly databaseSessionManager: DatabaseSessionManager,
  ) {}

  async save(exampleModel: Partial<ExampleModel>): Promise<ExampleModel> {
    const repository = this.databaseSessionManager
      .getDatabaseSession(SECOND_DATABASE_CONNECTION)
      .getRepository(ExampleModel);
    return await repository.save(exampleModel);
  }
}
