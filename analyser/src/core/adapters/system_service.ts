import { System } from "../entities/system";

export interface SystemServiceInterface {
  createSystem: (system: System) => Promise<void>;
}
