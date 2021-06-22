import { Dataservice } from "./dataservice.interface";

export default async (
  { name }: any,
  ds: Dataservice,
  publishAnalysis: (event: any) => void
): Promise<void> => {
  const payload = await ds.getDBperService(name);
  console.log(payload);
  publishAnalysis({
    type: "system analysed",
    payload,
  });
};
