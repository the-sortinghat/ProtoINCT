import { Dataservice } from "./dataservice.interface";

export default async (
  databaseUsagePayload: any,
  ds: Dataservice
): Promise<void> => {
  const dbName = databaseUsagePayload.databaseName;
  const svcName = databaseUsagePayload.serviceName;
  const systemName = databaseUsagePayload.systemName;
  const namespace = databaseUsagePayload.namespace || null;

  await ds.createDatabaseUsage(dbName, svcName, systemName, namespace);
};
