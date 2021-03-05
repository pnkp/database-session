import { DatabaseSession, InjectDatabaseSessionManager } from '../../src';
import { DatabaseSessionManager } from '../../src/database-session.manager';
import { ExampleModel } from './example.model';
import { SECOND_DATABASE_CONNECTION } from './database-session-test.module';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExampleSecondRepository {
  private databaseSession: DatabaseSession;
  constructor(
    @InjectDatabaseSessionManager()
    private readonly databaseSessionManager: DatabaseSessionManager,
  ) {
    this.databaseSession = this.databaseSessionManager.getDatabaseSession(
      SECOND_DATABASE_CONNECTION,
    );
  }

  async save(exampleModel: Partial<ExampleModel>): Promise<ExampleModel> {
    const repository = this.databaseSession.getRepository(ExampleModel);
    return await repository.save(exampleModel);
  }
}
