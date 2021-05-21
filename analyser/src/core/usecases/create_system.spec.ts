import { Database } from "../entities/database";
import { Service } from "../entities/service";
import { System } from "../entities/system";
import { CreateSystem } from "./create_system";

describe("CreateSystem", () => {
  let mockAnalyse: any;
  let target: CreateSystem;
  let payload;

  beforeEach(() => {
    mockAnalyse = { run: jest.fn() };
    target = new CreateSystem(mockAnalyse);
    payload = {
      systemName: "test",
      services: [],
      databases: [],
      databaseUsage: [],
    };
  });

  it("properly creates a system", () => {
    target.run(payload);

    const expectedSystem = new System("test");

    expect(mockAnalyse.run).toHaveBeenCalledWith(expectedSystem);
  });

  describe("with database", () => {
    let expectedDatabase: Database;

    beforeEach(() => {
      payload.databases.push({
        id: 1,
        make: "MongoDB",
        model: "document",
      });

      expectedDatabase = new Database("document", "MongoDB", 1);
    });

    it("properly creates databases", () => {
      target.run(payload);

      const expectedSystem = new System("test");
      expectedSystem.addDatabase(expectedDatabase);

      expect(mockAnalyse.run).toHaveBeenCalledWith(expectedSystem);
    });

    describe("with service", () => {
      beforeEach(() => {
        payload.services.push({
          id: 1,
          name: "foo",
        });
      });

      it("properly creates free services", () => {
        payload.databaseUsage.push({
          serviceID: 1,
          databaseID: 1,
        });

        target.run(payload);

        const expectedSystem = new System("test");

        const svc = new Service("foo", 1);
        expectedDatabase.addService(svc);

        expectedSystem.addDatabase(expectedDatabase);

        expect(mockAnalyse.run).toHaveBeenCalledWith(expectedSystem);
      });

      it("properly creates namespaced services", () => {
        payload.databaseUsage.push({
          serviceID: 1,
          databaseID: 1,
          namespace: "baz",
        });

        target.run(payload);

        const expectedSystem = new System("test");

        const svc = new Service("foo", 1);
        expectedDatabase.addService(svc, "baz");

        expectedSystem.addDatabase(expectedDatabase);

        expect(mockAnalyse.run).toHaveBeenCalledWith(expectedSystem);
      });
    });
  });
});
