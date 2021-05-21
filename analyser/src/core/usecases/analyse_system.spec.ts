import { MessageBrokerClientInterface } from "../adapters/message_broker_client";
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
});
