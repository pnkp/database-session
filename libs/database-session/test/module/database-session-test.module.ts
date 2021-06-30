import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { ExampleRepository } from './example.repository';
import { ExampleModel } from './example.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DatabaseSessionInitializer,
  DatabaseSessionModule,
  InjectDatabaseSessionInitializer,
} from '../../src';
import { ExampleSecondRepository } from './example-second.repository';
import { TransactionMiddleware } from '../../src/transaction.middlewares';

export const SECOND_DATABASE_CONNECTION = 'second-database';

@Module({
  providers: [ExampleRepository, ExampleSecondRepository],
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'postgres',
      username: 'postgres',
      synchronize: true,
      entities: [ExampleModel],
    }),
    TypeOrmModule.forRoot({
      name: SECOND_DATABASE_CONNECTION,
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      password: 'postgres',
      username: 'postgres',
      synchronize: true,
      entities: [ExampleModel],
    }),
    DatabaseSessionModule.forRoot(),
  ],
  controllers: [TransactionController],
})
export class DatabaseSessionTestModule implements NestModule {
  constructor(
    @InjectDatabaseSessionInitializer()
    private readonly databaseSessionInitializer: DatabaseSessionInitializer,
  ) {}

  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(TransactionMiddleware(this.databaseSessionInitializer))
      .forRoutes('*');
  }
}
