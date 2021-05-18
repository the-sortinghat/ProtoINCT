import { Service } from "./entities/service";

export interface SystemServiceInterface {
  createSystem: (system: System) => Promise<void>;
}
