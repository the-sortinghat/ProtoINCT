import { Dataservice } from "./dataservice.interface";

export default async (databasePayload: any, ds: Dataservice): Promise<void> => {
  console.log(databasePayload);
};
