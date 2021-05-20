import { MessageBrokerClientInterface } from "./core/adapters/message_broker_client";
import { Message } from "./core/entities/types";
import { AnalyseSystem } from "./core/usecases/analyse_system";
import { CreateSystem } from "./core/usecases/create_system";

class MockClient implements MessageBrokerClientInterface {
  publish(channel: string, message: Message) {
    console.log(channel, message);
  }
}

const analyseUseCase = new AnalyseSystem(new MockClient());
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

createSystem.run(event.payload);
