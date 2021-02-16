import { EntityManager } from "typeorm";

export interface SessionEntityManager {
  getEntityManager(): EntityManager;
}
