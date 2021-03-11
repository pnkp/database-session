import { Body, Controller, Delete, Post } from '@nestjs/common';
import { ExampleRepository } from './example.repository';
import { ExampleModel } from './example.model';
import { DatabaseSession, InjectDatabaseSessionManager } from '../../src';
import { DatabaseSessionManager } from '../../src/database-session.manager';
import { SECOND_DATABASE_CONNECTION } from './database-session-test.module';
import { ExampleSecondRepository } from './example-second.repository';
import { Transaction } from '../../src';

@Controller('transactions')
export class TransactionController {
  private databaseSession: DatabaseSession;
  private databaseSessionSecondDatabase: DatabaseSession;
  constructor(
    private readonly exampleRepository: ExampleRepository,
    private readonly exampleSecondRepository: ExampleSecondRepository,
    @InjectDatabaseSessionManager()
    private readonly databaseSessionManager: DatabaseSessionManager,
  ) {
    this.databaseSession = this.databaseSessionManager.getDatabaseSession();
    this.databaseSessionSecondDatabase = this.databaseSessionManager.getDatabaseSession(
      SECOND_DATABASE_CONNECTION,
    );
  }

  @Post()
  async commitTransaction(
    @Body() data: { value: string },
  ): Promise<ExampleModel> {
    try {
      await this.databaseSession.transactionStart();
      const result = await this.exampleRepository.save(data);
      await this.databaseSession.transactionCommit();
      return result;
    } catch (e) {
      await this.databaseSession.transactionRollback();
      throw e;
    }
  }

  @Delete()
  async rollbackTransaction(@Body() data: { value: string }): Promise<never> {
    try {
      await this.databaseSession.transactionStart();
      await this.exampleRepository.save(data);
      throw new Error('Transaction will be rollback!');
      await this.databaseSession.transactionCommit();
    } catch (e) {
      await this.databaseSession.transactionRollback();
      await this.exampleRepository.save({ value: 'rollback transaction' });
      throw e;
    }
  }

  @Post('second-database')
  async commitTransactionInSecondDatabase(
    @Body() data: { value: string },
  ): Promise<ExampleModel> {
    try {
      await this.databaseSessionSecondDatabase.transactionStart();
      const result = await this.exampleSecondRepository.save(data);
      await this.databaseSessionSecondDatabase.transactionCommit();
      return result;
    } catch (e) {
      await this.databaseSessionSecondDatabase.transactionRollback();
      throw e;
    }
  }

  @Delete('second-database')
  async rollbackTransactionInSecondDatabase(
    @Body() data: { value: string },
  ): Promise<never> {
    try {
      await this.databaseSessionSecondDatabase.transactionStart();
      await this.exampleSecondRepository.save(data);
      throw new Error('Transaction will be rollback!');
      await this.databaseSession.transactionCommit();
    } catch (e) {
      await this.databaseSessionSecondDatabase.transactionRollback();
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
    try {
      await this.databaseSession.transactionStart();
      await this.databaseSessionSecondDatabase.transactionStart();

      await this.exampleRepository.save(data);
      await this.exampleSecondRepository.save(data);

      await this.databaseSession.transactionCommit();
      throw new Error('Transaction will be rollback!');
    } catch (e) {
      await this.databaseSessionSecondDatabase.transactionRollback();
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
    await this.databaseSession.transactionStart();
    await this.databaseSession.transactionStart();
  }
}
