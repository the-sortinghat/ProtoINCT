import { MessageBrokerClientInterface } from "../adapters/message_broker_client";
import { Database } from "../entities/database";
import { Service } from "../entities/service";
import { System } from "../entities/system";
import { AnalyseSystem } from "./analyse_system";

describe("AnalyseSystem", () => {
  const systemName = "test";
  const type = "system analysed";

  let mockBroker: MessageBrokerClientInterface;
  let target: AnalyseSystem;
  let system: System;

  beforeEach(() => {
    mockBroker = { publish: jest.fn() };
    target = new AnalyseSystem(mockBroker);
    system = new System(systemName);
  });

  it("publishes an empty payload event when a db-less system is provided", () => {
    target.run(system);

    const event = {
      type,
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
        services: [2, 1],
      },
    ];

    const event = {
      type,
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

  it("identifies as sharedDatabase when two services uses the same namespace", () => {
    const db = new Database("document", "MongoDB", 1);
    const svc1 = new Service("foo", 1);
    const svc2 = new Service("bar", 2);

    const ns = "baz";
    db.addService(svc1, ns);
    db.addService(svc2, ns);

    system.addDatabase(db);

    target.run(system);

    const event = {
      type,
      systemName,
      payload: {
        sharedDatabase: [
          {
            databaseID: 1,
            services: [1, 2],
            namespace: ns,
          },
        ],
        databasePerService: [],
      },
    };

    expect(mockBroker.publish).toHaveBeenCalledWith(
      "system_analysed",
      JSON.stringify(event)
    );
  });

  it("identifies as sharedDatabase when there are two free services", () => {
    const db = new Database("document", "MongoDB", 1);
    const svc1 = new Service("foo", 1);
    const svc2 = new Service("bar", 2);

    db.addService(svc1);
    db.addService(svc2);

    system.addDatabase(db);

    target.run(system);

    const event = {
      type,
      systemName,
      payload: {
        sharedDatabase: [
          {
            databaseID: 1,
            services: [1, 2],
          },
        ],
        databasePerService: [],
      },
    };

    expect(mockBroker.publish).toHaveBeenCalledWith(
      "system_analysed",
      JSON.stringify(event)
    );
  });

  it("identifies as databasePerService when a database is used by a single service", () => {
    const db = new Database("document", "MongoDB", 1);
    const svc = new Service("foo", 1);
    db.addService(svc);

    system.addDatabase(db);

    target.run(system);

    const event = {
      type,
      systemName,
      payload: {
        sharedDatabase: [],
        databasePerService: [
          {
            databaseID: 1,
            serviceID: 1,
          },
        ],
      },
    };

    expect(mockBroker.publish).toHaveBeenCalledWith(
      "system_analysed",
      JSON.stringify(event)
    );
  });

  it("identifies as databasePerService when a single database is used by two services in two different namespaces", () => {
    const db = new Database("document", "MongoDB", 1);
    const svc1 = new Service("foo", 1);
    db.addService(svc1, "baz1");

    const svc2 = new Service("foo", 2);
    db.addService(svc2, "baz2");

    system.addDatabase(db);

    target.run(system);

    const event = {
      type,
      systemName,
      payload: {
        sharedDatabase: [],
        databasePerService: [
          {
            databaseID: 1,
            serviceID: 1,
            namespace: "baz1",
          },
          {
            databaseID: 1,
            serviceID: 2,
            namespace: "baz2",
          },
        ],
      },
    };

    expect(mockBroker.publish).toHaveBeenCalledWith(
      "system_analysed",
      JSON.stringify(event)
    );
  });
});
