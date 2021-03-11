import { Inject } from '@nestjs/common';
import { DATABASE_SESSION_MANAGER } from './inject-decorators';
import { DatabaseSessionManager } from './database-session.manager';
import { assignMetadata, copyMetadata } from './metadata-utils';

export function Transaction(connectionName = 'default') {
  const inject = Inject(DATABASE_SESSION_MANAGER);

  return (
    target: any,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
  ) => {
    inject(target, 'databaseSessionManager');

    const originalMethod = propertyDescriptor.value;
    const copiedMetadata = copyMetadata(originalMethod);

    propertyDescriptor.value = async function (...args: any) {
      const databaseSessionManager: DatabaseSessionManager = this
        .databaseSessionManager;
      const databaseSession = databaseSessionManager.getDatabaseSession(
        connectionName,
      );

      try {
        await databaseSession.transactionStart();
        const result = await originalMethod.apply(this, args);
        await databaseSession.transactionCommit();
        return result;
      } catch (e) {
        await databaseSession.transactionRollback();
        throw e;
      }
    };

    assignMetadata(propertyDescriptor.value, copiedMetadata);
  };
}
