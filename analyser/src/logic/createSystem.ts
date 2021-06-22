import { Dataservice } from "./dataservice.interface";

export default async ({ name }: any, ds: Dataservice): Promise<void> => {
  await ds.createSystem(name);
};
