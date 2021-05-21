import { Database } from "../entities/database";
import { System } from "../entities/system";
import { Service } from "../entities/service";
import { ID, Namespace } from "../entities/types";
import { MessageBrokerClientInterface } from "../adapters/message_broker_client";

export class AnalyseSystem {
  constructor(private brokerClient: MessageBrokerClientInterface) {}

  public run(system: System): void {
    const sharedDatabase: any[] = [];
    const databasePerService: any[] = [];

    system.databases.forEach((db: Database): void => {
      const { free, namespaced } = db.services;

      const namespacedEmpty = Object.keys(namespaced).every(
        (n: Namespace): boolean => namespaced[n].length === 0
      );

      const freeEmpty = free.length === 0;

      if (!namespacedEmpty && !freeEmpty) {
        // there's at least one free service and one namespaced
        // since there's no way to acquire the namespace of the
        //   free service, let's consider all services as
        //   "sharing the instance", hence, sharing database

        const services = Object.keys(namespaced)
          .reduce(
            (acc: Service[], curr: string): Service[] =>
              acc.concat(namespaced[curr]),
            []
          )
          .concat(free)
          .map(({ id }: Service): ID => id);

        sharedDatabase.push({
          databaseID: db.id,
          services,
        });
      } else {
        if (!namespacedEmpty) {
          const namespaces = Object.keys(namespaced);

          namespaces.forEach((n: Namespace): void => {
            if (namespaced[n].length > 1) {
              sharedDatabase.push({
                databaseID: db.id,
                services: namespaced[n].map((s: Service): ID => s.id),
                namespace: n,
              });
            } else {
              databasePerService.push({
                databaseID: db.id,
                serviceID: namespaced[n][0].id,
                namespace: n,
              });
            }
          });
        } else {
          if (free.length > 1) {
            sharedDatabase.push({
              databaseID: db.id,
              services: free.map((s: Service): ID => s.id),
            });
          } else {
            databasePerService.push({
              databaseID: db.id,
              serviceID: free[0].id,
            });
          }
        }
      }
    });

    const event = {
      type: "system analysed",
      systemName: system.name,
      payload: {
        sharedDatabase,
        databasePerService,
      },
    };

    this.brokerClient.publish("system_analysed", JSON.stringify(event));
  }
}
