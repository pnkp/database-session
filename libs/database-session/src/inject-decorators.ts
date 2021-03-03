import { Inject } from '@nestjs/common';

export const DATABASE_SESSION = 'DatabaseSession';
export const SESSION_QUERY_RUNNER = 'SessionQueryRunner';

export const InjectDatabaseSession: () => ParameterDecorator = () =>
  Inject(DATABASE_SESSION);

export const InjectSessionQueryRunner: () => ParameterDecorator = () =>
  Inject(SESSION_QUERY_RUNNER);
