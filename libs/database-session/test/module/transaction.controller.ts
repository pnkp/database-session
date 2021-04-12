import { Body, Controller, Delete, Post } from '@nestjs/common';
import { ExampleRepository } from './example.repository';
import { ExampleModel } from './example.model';
import { InjectDatabaseSessionManager, Transaction } from '../../src';
import { SECOND_DATABASE_CONNECTION } from './database-session-test.module';
import { ExampleSecondRepository } from './example-second.repository';
import { DatabaseSessionManager } from "../../src/database/database-session.manager";

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly exampleRepository: ExampleRepository,
    private readonly exampleSecondRepository: ExampleSecondRepository,
    @InjectDatabaseSessionManager()
    private readonly databaseSessionManager: DatabaseSessionManager,
  ) {}

  @Post()
  async commitTransaction(
    @Body() data: { value: string },
  ): Promise<ExampleModel> {
    const databaseSession = this.databaseSessionManager.getDatabaseSession();

    try {
      await databaseSession.transactionStart();
      const result = await this.exampleRepository.save(data);
      await databaseSession.transactionCommit();
      return result;
    } catch (e) {
      await databaseSession.transactionRollback();
      throw e;
    }
  }

  @Delete()
  async rollbackTransaction(@Body() data: { value: string }): Promise<never> {
    const databaseSession = this.databaseSessionManager.getDatabaseSession();

    try {
      await databaseSession.transactionStart();
      await this.exampleRepository.save(data);
      throw new Error('Transaction will be rollback!');
      await databaseSession.transactionCommit();
    } catch (e) {
      await databaseSession.transactionRollback();
      await this.exampleRepository.save({ value: 'rollback transaction' });
      throw e;
    }
  }

  @Post('second-database')
  async commitTransactionInSecondDatabase(
    @Body() data: { value: string },
  ): Promise<ExampleModel> {
    const databaseSessionSecondDatabase = this.databaseSessionManager.getDatabaseSession(
      SECOND_DATABASE_CONNECTION,
    );

    try {
      await databaseSessionSecondDatabase.transactionStart();
      const result = await this.exampleSecondRepository.save(data);
      await databaseSessionSecondDatabase.transactionCommit();
      return result;
    } catch (e) {
      await databaseSessionSecondDatabase.transactionRollback();
      throw e;
    }
  }

  @Delete('second-database')
  async rollbackTransactionInSecondDatabase(
    @Body() data: { value: string },
  ): Promise<never> {
    const databaseSessionSecondDatabase = this.databaseSessionManager.getDatabaseSession(
      SECOND_DATABASE_CONNECTION,
    );

    try {
      await databaseSessionSecondDatabase.transactionStart();
      await this.exampleSecondRepository.save(data);
      throw new Error('Transaction will be rollback!');
      await databaseSessionSecondDatabase.transactionCommit();
    } catch (e) {
      await databaseSessionSecondDatabase.transactionRollback();
      await this.exampleSecondRepository.save({
        value: 'rollback transaction in second database',
      });
      throw e;
    }
  }

  @Post('combine')
  async combineOfTwoDatabaseTransactions(
    @Body() data: { value: string },
  ): Promise<never> {
    const databaseSession = this.databaseSessionManager.getDatabaseSession();
    const databaseSessionSecondDatabase = this.databaseSessionManager.getDatabaseSession(
      SECOND_DATABASE_CONNECTION,
    );

    try {
      await databaseSession.transactionStart();
      await databaseSessionSecondDatabase.transactionStart();

      await this.exampleRepository.save(data);
      await this.exampleSecondRepository.save(data);

      await databaseSession.transactionCommit();
      throw new Error('Transaction will be rollback!');
    } catch (e) {
      await databaseSessionSecondDatabase.transactionRollback();
      await this.exampleSecondRepository.save({
        value: 'rollback transaction in second database',
      });
      throw e;
    }
  }

  @Post('decorator')
  @Transaction()
  async commitByDecorator(
    @Body() data: { value: string },
  ): Promise<ExampleModel> {
    return await this.exampleRepository.save(data);
  }

  @Transaction()
  @Delete('decorator')
  async rollbackByDecorator(@Body() data: { value: string }): Promise<never> {
    await this.exampleRepository.save(data);
    throw new Error('transaction will be rollback');
  }

  @Post('conflict')
  async transactionConflict(): Promise<void> {
    const databaseSession = this.databaseSessionManager.getDatabaseSession();
    await databaseSession.transactionStart();
    await databaseSession.transactionStart();
  }
}
