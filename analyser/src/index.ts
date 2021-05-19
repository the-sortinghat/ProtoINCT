import { SystemServiceInterface } from "./core/adapters/system_service";
import { System } from "./core/entities/system";
import { CreateSystem } from "./core/usecases/create_system";

class MockService implements SystemServiceInterface {
  async createSystem(sys: System): Promise<void> {
    return new Promise((res) => {
      setTimeout(() => {
        console.log(sys);
        res();
      }, 250);
    });
  }
}

const createSystem = new CreateSystem(new MockService());

createSystem.run("foo");
