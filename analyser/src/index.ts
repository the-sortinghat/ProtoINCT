import { CreateSystem } from "./core/usecases/create_system";

const createSystem = new CreateSystem();

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
    ],
    databaseUsage: [
      {
        serviceID: 1,
        databaseID: 1,
      },
      {
        serviceID: 2,
        databaseID: 1,
      },
    ],
  },
};

createSystem.run(event.payload);
