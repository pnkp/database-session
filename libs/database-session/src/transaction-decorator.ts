import { Inject } from '@nestjs/common';
import { DATABASE_SESSION_MANAGER } from './inject-decorators';
import { DatabaseSessionManager } from './database-session.manager';
import { assignMetadata, copyMetadata } from './metadata-utils';
import { v4 as uuid } from 'uuid';

/**
 * If you do not provide a parameter, you will use the transaction for the "default" database connection
 * @param connectionName
 */
export function Transaction(connectionName = 'default') {
  const inject = Inject(DATABASE_SESSION_MANAGER);

  return (
    target: any,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
  ) => {
    const injectorKey = `${uuid()}_databaseSessionManager`;
    inject(target, injectorKey);

    const originalMethod = propertyDescriptor.value;
    const copiedMetadata = copyMetadata(originalMethod);

    propertyDescriptor.value = async function (...args: any) {
      const databaseSessionManager: DatabaseSessionManager = this[injectorKey];
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
