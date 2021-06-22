import { Dataservice } from "./dataservice.interface";

export default async (systemPayload: any, ds: Dataservice): Promise<void> => {
  console.log(systemPayload);
};
