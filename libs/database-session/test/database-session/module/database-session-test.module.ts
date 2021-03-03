import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { ExampleRepository } from './example.repository';
import { ExampleModel } from './example.model';
import { Connection } from 'typeorm';
import { getConnectionToken, TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseSessionModule } from '../../../src';

@Module({
  providers: [ExampleRepository],
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
    DatabaseSessionModule.forRootAsync({
      useFactory: async (connection: Connection) => {
        return connection;
      },
      inject: [getConnectionToken()],
    }),
  ],
  controllers: [TransactionController],
})
export class DatabaseSessionTestModule {}
