import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseSessionModule } from "../../libs/database-session/src";
import { TestTransactionController } from "./testTransaction.controller";
import { ExampleRepository } from "./example.repository";
import { ExampleModel } from "./example.model";

@Module({
  providers: [ExampleRepository],
  imports: [TypeOrmModule.forRoot({
    driver: "postgres",
    host: "localhost",
    port: 5432,
    password: "postgres",
    username: "postgres",
    synchronize: true,
    entities: [ExampleModel],
  }), DatabaseSessionModule.forRoot()],
  controllers: [TestTransactionController]
})
export class TestModule {}
