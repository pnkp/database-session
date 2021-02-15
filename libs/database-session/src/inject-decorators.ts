import { Inject } from "@nestjs/common";

export const DATABASE_SESSION = 'DatabaseSession';
export const SESSION_ENTITY_MANAGER = "SessionEntityManager";

export const InjectDatabaseSession: () => ParameterDecorator = () => Inject(DATABASE_SESSION);

export const InjectSessionEntityManager: () => ParameterDecorator = () => Inject(SESSION_ENTITY_MANAGER);
