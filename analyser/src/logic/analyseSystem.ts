import { Dataservice } from "./dataservice.interface";

export default async (
  { name }: any,
  ds: Dataservice,
  publishAnalysis: (event: any) => void
): Promise<void> => {
  const result = await ds.getDBperService(name);
  console.log(result);
  publishAnalysis({
    type: "system analysed",
    payload: {
      name,
      result,
    },
  });
};
