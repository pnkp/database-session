import { Body, Controller, Delete, Post } from "@nestjs/common";
import { ExampleRepository } from "./example.repository";
import { ExampleModel } from "./example.model";
import { DatabaseSession, InjectDatabaseSession } from "../../../libs/database-session/src";

@Controller('transactions')
export class TestTransactionController {

  constructor(
    private readonly exampleRepository: ExampleRepository,
    @InjectDatabaseSession()
    private readonly databaseSession: DatabaseSession
  ) {
  }

  @Post()
  async commitTransaction(@Body() data: { value: string },): Promise<ExampleModel> {
    try {
      await this.databaseSession.transactionStart()
      const result = await this.exampleRepository.save(data);
      await this.databaseSession.transactionCommit();
      return result;
    } catch (e) {
      await this.databaseSession.transactionRollback();
      throw e;
    }
  }

  @Delete()
  async rollbackTransaction(
    @Body() data: { value: string },
  ): Promise<never> {
    try {
      await this.databaseSession.transactionStart()
      await this.exampleRepository.save(data);
      throw new Error("Transaction will be rollback!")
      await this.databaseSession.transactionCommit();
    } catch (e) {
      await this.databaseSession.transactionRollback();
      await this.exampleRepository.save({ value: "rollback transaction" });
      throw e;
    }
  }
}
