import { DynamicModule, FactoryProvider, Global, Module } from '@nestjs/common';
import {
  DATABASE_SESSION_INITIALIZER,
  DATABASE_SESSION_MANAGER,
} from './inject-decorators';
import { ConnectionManager, getConnectionManager } from 'typeorm';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';
import { AsyncStorageDatabaseSessionManager } from './database/async-storage-database-session.manager';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { DatabaseSessionInitializer } from './database/database-session.manager';

@Global()
@Module({})
export class DatabaseSessionModule {
  private static readonly DATABASE_SESSION_OPTIONS_PROVIDER =
    'DATABASE_SESSION_OPTIONS_PROVIDER';

  static forRoot(options?: DatabaseSessionModuleOptions) {
    const providers: Provider[] = [
      {
        provide: DATABASE_SESSION_INITIALIZER,
        useFactory: (
          asyncStorageDatabaseSessionManager?: AsyncStorageDatabaseSessionManager,
        ): DatabaseSessionInitializer => {
          return asyncStorageDatabaseSessionManager;
        },
        inject: [DATABASE_SESSION_MANAGER],
      },
      {
        provide: DATABASE_SESSION_MANAGER,
        useFactory: (connectionManager?: ConnectionManager) => {
          connectionManager = connectionManager ?? getConnectionManager();
          return new AsyncStorageDatabaseSessionManager(connectionManager);
        },
        inject: options?.inject ?? [],
      },
    ];

    if (options) {
      providers.push({
        provide: this.DATABASE_SESSION_OPTIONS_PROVIDER,
        useFactory: options.useFactory,
        inject: options.inject,
      });
    }

    return {
      providers,
      exports: [DATABASE_SESSION_MANAGER, DATABASE_SESSION_INITIALIZER],
      module: DatabaseSessionModule,
      imports: options?.imports ?? [],
    };
  }
}

export interface DatabaseSessionModuleOptions
  extends Omit<
    FactoryProvider<Promise<ConnectionManager>>,
    'provide' | 'scope'
  > {
  imports?: Array<
    Type | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
}
