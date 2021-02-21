import { Module } from "@nestjs/common";
import { DatabaseSessionModule } from "../../libs/database-session/src";
import { TestTransactionController } from "./testTransaction.controller";
import { ExampleRepository } from "./example.repository";
import { ExampleModel } from "./example.model";
import { Connection } from "typeorm";
import { getConnectionToken, TypeOrmModule } from "@nestjs/typeorm";

@Module({
  providers: [ExampleRepository],
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      password: "postgres",
      username: "postgres",
      synchronize: true,
      entities: [ExampleModel],
    }),
    DatabaseSessionModule.forRootAsync({
      useFactory: async (connection: Connection) => {
        return connection;
      },
      inject: [getConnectionToken()]
    })
  ],
  controllers: [TestTransactionController]
})
export class TestModule {}
