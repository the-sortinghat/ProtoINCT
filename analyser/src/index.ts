import { Message } from "node-nats-streaming";
import stan, { channels } from "./tools/stan";
import neo4j from "./tools/neo4j";
import createService from "./logic/createService";
import createSystem from "./logic/createSystem";
import createDatabase from "./logic/createDatabase";
import createDatabaseUsage from "./logic/createDatabaseUsage";

stan.on("connect", () => {
  console.log("stan connected");

  const neo4jConn = neo4j.connect();

  const dataService = { rawConn: neo4jConn };

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
