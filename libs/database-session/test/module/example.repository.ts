import { Injectable } from '@nestjs/common';
import { ExampleModel } from './example.model';
import { DatabaseSession, InjectDatabaseSessionManager } from '../../src';
import { DatabaseSessionManager } from '../../src/database-session.manager';

@Injectable()
export class ExampleRepository {
  private databaseSession: DatabaseSession;
  constructor(
    @InjectDatabaseSessionManager()
    private readonly databaseSessionManager: DatabaseSessionManager,
  ) {
    this.databaseSession = this.databaseSessionManager.getDatabaseSession();
  }

  async save(exampleModel: Partial<ExampleModel>): Promise<ExampleModel> {
    const repository = this.databaseSession.getRepository(ExampleModel);
    return await repository.save(exampleModel);
  }
}
