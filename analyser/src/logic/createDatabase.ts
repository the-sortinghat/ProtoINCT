import { Dataservice } from "./dataservice.interface";

export default async (
  { name, systemName }: any,
  ds: Dataservice
): Promise<void> => {
  await ds.createDatabase(name, systemName);
};
