import { Message } from "node-nats-streaming";
import stan, { channels } from "./tools/stan";
import { Neo4jDataservice } from "./tools/neo4j";
import createService from "./logic/createService";
import createSystem from "./logic/createSystem";
import createDatabase from "./logic/createDatabase";
import createDatabaseUsage from "./logic/createDatabaseUsage";
import analyseSystem from "./logic/analyseSystem";

const url = process.env.NEO4J_URL as string;
const user = process.env.NEO4J_USER as string;
const pw = process.env.NEO4J_PASSWORD as string;

function sleep(s: number) {
  return new Promise((res) => {
    setTimeout(res, s * 1000);
  });
}

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

  stan
    .subscribe(
      channels.SystemCreationCompleted,
      stan.subscriptionOptions().setDeliverAllAvailable()
    )
    .on("message", async (msg: Message) => {
      const { payload } = JSON.parse(msg.getData() as string);
      const publish = (event: any) => {
        stan.publish(channels.SystemAnalysed, JSON.stringify(event));
      };
      await analyseSystem(payload, dataService, publish);
    });

  setTimeout(async () => {
    stan.publish(
      channels.SystemCreationStarted,
      JSON.stringify({ payload: { name: "Example" } })
    );
    await sleep(1);

    stan.publish(
      channels.ServiceCreated,
      JSON.stringify({ payload: { name: "Svc 1", systemName: "Example" } })
    );
    await sleep(1);

    stan.publish(
      channels.DatabaseCreated,
      JSON.stringify({ payload: { name: "DB 1", systemName: "Example" } })
    );
    await sleep(1);

    stan.publish(
      channels.DatabaseUsageCreated,
      JSON.stringify({
        payload: {
          databaseName: "DB 1",
          serviceName: "Svc 1",
          systemName: "Example",
        },
      })
    );
    await sleep(1);

    stan.publish(
      channels.SystemCreationCompleted,
      JSON.stringify({ payload: { name: "Example" } })
    );
  }, 500);
});
