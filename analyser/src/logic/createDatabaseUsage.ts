import { Dataservice } from "./dataservice.interface";

export default async (
  databaseUsagePayload: any,
  ds: Dataservice
): Promise<void> => {
  console.log(databaseUsagePayload);
};
