import { DynamicModule, Global, Module, Scope } from '@nestjs/common';
import { TypeOrmDatabaseSession } from './type-orm.database-session';
import { DATABASE_SESSION, SESSION_ENTITY_MANAGER } from "./inject-decorators";
import { Connection } from "typeorm";
import { FactoryProvider } from "@nestjs/common/interfaces/modules/provider.interface";

@Global()
@Module({})
export class DatabaseSessionModule {
  static forRootAsync(factory: DatabaseSessionModuleOptions): DynamicModule {
    return DatabaseSessionModule.forRoot(factory);
  }

  private static forRoot(factory: DatabaseSessionModuleOptions): DynamicModule {
    return {
      providers: [
        {
          useFactory: factory.useFactory,
          inject: factory.inject,
          provide: 'DatabaseSessionOptions'
        },
        {
          provide: DATABASE_SESSION,
          useFactory: async (connection: Connection) => {
            return new TypeOrmDatabaseSession(connection);
          },
          scope: Scope.REQUEST,
          inject: ['DatabaseSessionOptions'],
        },
        {
          provide: SESSION_ENTITY_MANAGER,
          useFactory: (typeOrmDatabaseSession: TypeOrmDatabaseSession) => {
            return typeOrmDatabaseSession.getEntityManager();
          },
          inject: [DATABASE_SESSION]
        }
      ],
      exports: [DATABASE_SESSION, SESSION_ENTITY_MANAGER],
      imports: factory.imports,
      module: DatabaseSessionModule,
    };
  }
}

export interface DatabaseSessionModuleOptions extends Omit<FactoryProvider<Promise<Connection>>, "provide" | "scope"> {
  imports?: DynamicModule[];
}
