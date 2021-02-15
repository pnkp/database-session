import { DynamicModule, Module, Scope } from '@nestjs/common';
import { TypeOrmDatabaseSession } from './type-orm.database-session';
import { DATABASE_SESSION, InjectDatabaseSession, SESSION_ENTITY_MANAGER } from "./inject-decorators";
import { Connection, ConnectionOptions } from "typeorm";
import { getConnectionToken } from "@nestjs/typeorm";

@Module({})
export class DatabaseSessionModule {
  static forRoot(connectionName?: string): DynamicModule {
    return {
      providers: [
        {
          provide: DATABASE_SESSION,
          useFactory: (connection: Connection) => {
            return new TypeOrmDatabaseSession(connection);
          },
          scope: Scope.REQUEST,
          inject: [getConnectionToken(connectionName)]
        },
        {
          provide: SESSION_ENTITY_MANAGER,
          useFactory: (typeOrmDatabaseSession: TypeOrmDatabaseSession) => {
            return typeOrmDatabaseSession;
          },
          inject: [DATABASE_SESSION]
        }
      ],
      exports: [DATABASE_SESSION, SESSION_ENTITY_MANAGER],
      module: DatabaseSessionModule,
    };
  }
}
