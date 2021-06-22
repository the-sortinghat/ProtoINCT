import { Dataservice } from "./dataservice.interface";

export default async (servicePayload: any, ds: Dataservice): Promise<void> => {
  console.log(servicePayload);
};
