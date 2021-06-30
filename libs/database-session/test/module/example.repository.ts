import { Injectable } from '@nestjs/common';
import { ExampleModel } from './example.model';
import { DatabaseSessionManager, InjectDatabaseSessionManager } from "../../src";

@Injectable()
export class ExampleRepository {
  constructor(
    @InjectDatabaseSessionManager()
    private readonly databaseSessionManager: DatabaseSessionManager,
  ) {}

  async save(exampleModel: Partial<ExampleModel>): Promise<ExampleModel> {
    const repository = this.databaseSessionManager
      .getDatabaseSession()
      .getRepository(ExampleModel);
    return await repository.save(exampleModel);
  }
}
