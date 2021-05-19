import { SystemServiceInterface } from "../adapters/system_service";
import { System } from "../entities/system";

export class CreateSystem {
  constructor(private systemService: SystemServiceInterface) {}

  async run(name: string): Promise<void> {
    const system = new System(name);
    await this.systemService.createSystem(system);
  }
}
