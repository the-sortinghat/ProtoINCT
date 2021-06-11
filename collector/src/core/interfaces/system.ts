import { ServiceInterface } from './service';
import { DatabaseInterface } from './database';
import { DatabaseUsageInterface } from './database_usage';

export interface SystemInterface {
  name: string;
  services: ServiceInterface[];
  databases: DatabaseInterface[];
  databaseUsage: DatabaseUsageInterface[];
}
