import { Inject } from '@nestjs/common';

export const DATABASE_SESSION = 'DatabaseSession';
export const DATABASE_SESSION_MANAGER = 'DatabaseSessionManager';

export const composeDatabaseSessionProviderName = (
  connectionName = 'default',
) => {
  return `${DATABASE_SESSION}_connection_${connectionName}`;
};

export const InjectDatabaseSessionManager = () =>
  Inject(DATABASE_SESSION_MANAGER);
