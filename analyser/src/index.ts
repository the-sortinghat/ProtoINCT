import { AnalyseSystem } from "./core/usecases/analyse_system";
import { CreateSystem } from "./core/usecases/create_system";
import { NATSStreamingClient } from "./framework/nats_streaming_client";

const stan = new NATSStreamingClient(
  process.env.BROKER_CLUSTER_ID as string,
  process.env.BROKER_CLIENT_ID as string,
  process.env.BROKER_URL
);

const analyseUseCase = new AnalyseSystem(stan);
const createSystem = new CreateSystem(analyseUseCase);

const event = {
  type: "system registered",
  payload: {
    systemName: "foo",
    services: [
      {
        name: "foozinho",
        id: 1,
      },
      {
        name: "foozão",
        id: 2,
      },
    ],
    databases: [
      {
        make: "MongoDB",
        model: "document",
        id: 1,
      },
      {
        make: "MongoDB",
        model: "document",
        id: 2,
      },
    ],
    databaseUsage: [
      {
        serviceID: 1,
        databaseID: 1,
      },
      {
        serviceID: 2,
        databaseID: 2,
      },
    ],
  },
};

stan.subscribe("system_registered", { fromTheBeginning: true }, (msg: any) => {
  const { payload } = JSON.parse(msg.getData());

  createSystem.run(payload);
});

stan.publish("system_registered", JSON.stringify(event));

stan.start();
