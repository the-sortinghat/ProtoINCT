import { Message } from "node-nats-streaming";
import stan, { channels } from "./tools/stan";
import { Neo4jDataservice } from "./tools/neo4j";
import createService from "./logic/createService";
import createSystem from "./logic/createSystem";
import createDatabase from "./logic/createDatabase";
import createDatabaseUsage from "./logic/createDatabaseUsage";

const url = process.env.NEO4J_URL as string;
const user = process.env.NEO4J_USER as string;
const pw = process.env.NEO4J_PASSWORD as string;

stan.on("connect", async () => {
  console.log("stan connected");

  const dataService = new Neo4jDataservice(url, user, pw);

  [
    {
      channel: "SystemCreationStarted",
      callback: createSystem,
    },
    {
      channel: "ServiceCreated",
      callback: createService,
    },
    {
      channel: "DatabaseCreated",
      callback: createDatabase,
    },
    {
      channel: "DatabaseUsageCreated",
      callback: createDatabaseUsage,
    },
  ].forEach(({ channel, callback }) => {
    stan
      .subscribe(
        channels[channel],
        stan.subscriptionOptions().setDeliverAllAvailable()
      )
      .on("message", async (msg: Message) => {
        const { payload } = JSON.parse(msg.getData() as string);
        await callback(payload, dataService);
      });
  });
});
