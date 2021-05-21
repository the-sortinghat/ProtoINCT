import { MessageBrokerClientInterface } from "../adapters/message_broker_client";
import { Database } from "../entities/database";
import { Service } from "../entities/service";
import { System } from "../entities/system";
import { AnalyseSystem } from "./analyse_system";

describe("AnalyseSystem", () => {
  let mockBroker: MessageBrokerClientInterface;
  let target: AnalyseSystem;

  beforeEach(() => {
    mockBroker = { publish: jest.fn() };
    target = new AnalyseSystem(mockBroker);
  });

  it("publishes an empty payload event when a db-less system is provided", () => {
    const systemName = "test";
    const system = new System(systemName);
    target.run(system);

    const event = {
      type: "system analysed",
      systemName,
      payload: {
        sharedDatabase: [],
        databasePerService: [],
      },
    };

    expect(mockBroker.publish).toHaveBeenCalledWith(
      "system_analysed",
      JSON.stringify(event)
    );
  });

  it("identifies as sharedDatabase when a namespaced and a free services are bound to the same database", () => {
    const systemName = "test";
    const system = new System(systemName);

    const db = new Database("document", "MongoDB", 1);
    const svc1 = new Service("foo", 1);
    const svc2 = new Service("bar", 2);

    db.addService(svc1);
    db.addService(svc2, "baz");

    system.addDatabase(db);

    target.run(system);

    const sharedDatabase = [
      {
        databaseID: 1,
        services: [
          { name: "bar", id: 2 },
          { name: "foo", id: 1 },
        ],
      },
    ];

    const event = {
      type: "system analysed",
      systemName,
      payload: {
        sharedDatabase,
        databasePerService: [],
      },
    };

    expect(mockBroker.publish).toHaveBeenCalledWith(
      "system_analysed",
      JSON.stringify(event)
    );
  });
});
