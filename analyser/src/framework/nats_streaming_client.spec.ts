import { NATSStreamingClient } from "./nats_streaming_client";
import stan from "node-nats-streaming";

jest.mock("node-nats-streaming");

function newClient() {
  return new NATSStreamingClient("test-cluster", "test-client");
}

describe(NATSStreamingClient, () => {
  let target: NATSStreamingClient;

  beforeEach(() => {
    target = newClient();
  });

  it("starts a connection", () => {
    expect(stan.connect).toHaveBeenCalled();
  });

  it("begins without being connected", () => {
    expect(target["isConnected"]).toBe(false);
  });

  describe("publish", () => {
    let mockConn: any;

    beforeEach(() => {
      mockConn = { publish: jest.fn() };
      stan.connect = jest.fn(() => mockConn);
      target = newClient();
    });

    it("stores messages while not connected", () => {
      target["isConnected"] = false;

      const expectation = { channel: "foo", message: "bar" };
      target.publish(expectation.channel, expectation.message);
      expect(target["outbox"]).toContainEqual(expectation);
      expect(mockConn.publish).not.toHaveBeenCalled();
    });

    it("publishes immidiately while connected", () => {
      target["isConnected"] = true;

      target.publish("foo", "bar");
      expect(mockConn.publish).toHaveBeenCalled();
    });
  });

  describe("subscribe", () => {
    let mockSubs: any;
    let mockConn: any;
    let opts: any;

    beforeEach(() => {
      mockSubs = { on: jest.fn() };
      mockConn = { subscribe: jest.fn(() => mockSubs) };
      stan.connect = jest.fn(() => mockConn);
      target = newClient();
      opts = { fromTheBeginning: true };
      target["parseOptions"] = jest.fn(() => opts);
    });

    it("stores subscriptions setups while not connected", () => {
      target["isConnected"] = false;

      const expectation = {
        channel: "foo",
        options: opts,
        callback: console.log,
      };
      target.subscribe(
        expectation.channel,
        expectation.options,
        expectation.callback
      );
      expect(target["pendingSubscription"]).toContainEqual(expectation);
    });

    it("subscribes immidiately while connected", () => {
      target["isConnected"] = true;

      const params = { channel: "foo", options: opts, callback: console.log };
      target.subscribe(params.channel, params.options, params.callback);

      expect(mockConn.subscribe).toHaveBeenCalledWith(
        params.channel,
        params.options
      );
      expect(mockSubs.on).toHaveBeenCalled();
    });
  });
});
