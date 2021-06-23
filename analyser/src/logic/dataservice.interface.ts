export interface Dataservice {
  createSystem: (name: string) => Promise<void>;
  createService: (serviceName: string, systemName: string) => Promise<void>;
  createDatabase: (dbName: string, systemName: string) => Promise<void>;
  createDatabaseUsage: (
    dbName: string,
    svcName: string,
    sysName: string,
    ns: string | null
  ) => Promise<void>;

  getDBperService: (systemName: string) => Promise<any>;
}
