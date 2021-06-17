import { DatabaseInterface, DatabaseUsageInterface, ServiceInterface } from '.';

export interface SendMessageInterface {
  serviceFound: (s: ServiceInterface) => void;
  databaseFound: (db: DatabaseInterface) => void;
  databaseUsageFound: (dbUsage: DatabaseUsageInterface) => void;
}
