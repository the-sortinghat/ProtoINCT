import { SystemServiceInterface } from "./core/adapters/system_service";
import { System } from "./core/entities/system";
import { CreateSystem } from "./core/usecases/create_system";

class MockService implements SystemServiceInterface {
  createSystem(sys: System): Promise<void> {
    return new Promise((res) => {
      setTimeout(() => {
        console.log(sys);
        res();
      }, 250);
    });
  }
}

const createSystem = new CreateSystem(new MockService());

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
