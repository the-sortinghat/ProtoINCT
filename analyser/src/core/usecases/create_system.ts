import { ID, Namespace } from "../entities/types.d";
import { Database } from "../entities/database";
import { Service } from "../entities/service";
import { System } from "../entities/system";

export interface ServicePayloadInterface {
  name: string;
  id: ID;
}

export interface DatabasePayloadInterface {
  id: ID;
  make: string;
  model: string;
}

export interface DatabaseUsagePayloadInterface {
  serviceID: ID;
  databaseID: ID;
  namespace?: Namespace;
}

export interface CreateSystemPayloadInterface {
  systemName: string;
  services: ServicePayloadInterface[];
  databases: DatabasePayloadInterface[];
  databaseUsage: DatabaseUsagePayloadInterface[];
}

export class CreateSystem {
  run(payload: CreateSystemPayloadInterface): void {
    const system = this.instanciateSystem(payload);

    const databases = this.instanciateAllDatabases(payload);
    databases.forEach((db: Database) => system.addDatabase(db));

    const services = this.instanciateAllServices(payload);
    this.relateServicesToDatabases(services, databases, payload.databaseUsage);
  }

  private instanciateSystem(payload: CreateSystemPayloadInterface): System {
    return new System(payload.systemName);
  }

  private instanciateService(payload: ServicePayloadInterface): Service {
    return new Service(payload.name, payload.id);
  }

  private instanciateAllServices(
    payload: CreateSystemPayloadInterface
  ): Service[] {
    return payload.services.length
      ? payload.services.map((svcPayload: ServicePayloadInterface) =>
          this.instanciateService(svcPayload)
        )
      : [];
  }

  private instanciateDatabase(payload: DatabasePayloadInterface): Database {
    return new Database(payload.model, payload.make, payload.id);
  }

  private instanciateAllDatabases(
    payload: CreateSystemPayloadInterface
  ): Database[] {
    return payload.databases.length
      ? payload.databases.map((dbPayload: DatabasePayloadInterface) =>
          this.instanciateDatabase(dbPayload)
        )
      : [];
  }

  private relateServicesToDatabases(
    services: Service[],
    databases: Database[],
    payload: DatabaseUsagePayloadInterface[]
  ): void {
    payload.forEach(
      ({ serviceID, databaseID, namespace }: DatabaseUsagePayloadInterface) => {
        const db = databases.find(
          (d: Database) => d.id === databaseID
        ) as Database;
        const svc = services.find(
          (s: Service) => s.id === serviceID
        ) as Service;

        if (namespace) db.addService(svc, namespace);
        else db.addService(svc);
      }
    );
  }
}
