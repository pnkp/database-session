import { Inject } from '@nestjs/common';

const DATABASE_SESSION: Readonly<string> = 'DatabaseSession';
const DATABASE_SESSION_MANAGER: Readonly<string> = 'DatabaseSessionManager';
const DATABASE_SESSION_INITIALIZER: Readonly<string> =
  'DatabaseSessionInitializer';

const InjectDatabaseSessionManager = () => Inject(DATABASE_SESSION_MANAGER);
const InjectDatabaseSessionInitializer = () =>
  Inject(DATABASE_SESSION_INITIALIZER);

const composeDatabaseSessionProviderName = (connectionName = 'default') => {
  return `${DATABASE_SESSION}_connection_${connectionName}`;
};

export {
  DATABASE_SESSION_MANAGER,
  DATABASE_SESSION,
  DATABASE_SESSION_INITIALIZER,
  InjectDatabaseSessionManager,
  InjectDatabaseSessionInitializer,
  composeDatabaseSessionProviderName,
  Inject,
};
