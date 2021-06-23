import stan from "node-nats-streaming";

const clusterID = process.env.BROKER_CLUSTER_ID as string;
const clientID = process.env.BROKER_CLIENT_ID as string;
const url = process.env.BROKER_URL as string;

interface ChannelGroup {
  [key: string]: string;
}

export const channels: ChannelGroup = {
  SystemCreationStarted: "new.system.start",
  SystemCreationCompleted: "new.system.end",
  ServiceCreated: "new.service",
  DatabaseCreated: "new.database",
  DatabaseUsageCreated: "new.database_usage",
  SystemAnalysed: "new.analysis",
};

export default stan.connect(clusterID, clientID, { url });
