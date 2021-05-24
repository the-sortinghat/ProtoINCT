import stan from "node-nats-streaming";
import { MessageBrokerClientInterface } from "../core/adapters/message_broker_client";
import { Message, MessageCallback } from "../core/entities/types";

export interface NATSStreamingClientOptionsInterface {
  fromLastReceived?: boolean;
  fromTheBeginning?: boolean;
  fromSequence?: number;
  fromGivenTime?: Date;
  withinDelta?: number;
}

interface Publication {
  channel: string;
  message: Message;
}

interface Subscription {
  channel: string;
  options: NATSStreamingClientOptionsInterface;
  callback: MessageCallback;
}

export class NATSStreamingClient implements MessageBrokerClientInterface {
  private conn: any;
  private isConnected: boolean;
  private outbox: Publication[];
  private pendingSubscription: Subscription[];

  constructor(clusterID: string, clientID: string, url = "localhost:4222") {
    this.isConnected = false;
    this.outbox = [];
    this.pendingSubscription = [];
    this.conn = stan.connect(clusterID, clientID, { url });
  }

  public publish(channel: string, message: Message): void {
    if (!this.isConnected) {
      this.outbox.push({ channel, message });
    } else {
      this.conn.publish(channel, message, () => {
        console.log("[NATSStreamingClient::publish]\t", message, "\n\n");
      });
    }
  }

  public subscribe(
    channel: string,
    options: NATSStreamingClientOptionsInterface,
    callback: MessageCallback
  ): void {
    const opts = this.parseOptions(options);

    if (!this.isConnected) {
      this.pendingSubscription.push({ channel, options: opts, callback });
    } else {
      const subs = this.conn.subscribe(channel, opts);
      subs.on("message", (msg: any) => {
        console.log(
          "[NATSStreamingClient::subscribe]\t",
          msg.getData(),
          "\n\n"
        );
        callback(msg);
      });
    }
  }

  public start(): void {
    this.conn.on("connect", () => {
      this.isConnected = true;

      this.pendingSubscription.forEach(({ channel, options, callback }) => {
        this.subscribe(channel, options, callback);
      });

      this.outbox.forEach(({ channel, message }) => {
        this.publish(channel, message);
      });
    });
  }

  private parseOptions(options: NATSStreamingClientOptionsInterface): any {
    const opsGenerator = this.conn.subscriptionOptions();

    if (options.fromTheBeginning) return opsGenerator.setDeliverAllAvailable();

    if (options.fromSequence)
      return opsGenerator.setStartAtSequence(options.fromSequence);

    if (options.fromGivenTime)
      return opsGenerator.setStartTime(options.fromGivenTime);

    if (options.withinDelta)
      return opsGenerator.setStartAtTimeDelta(options.withinDelta);

    return opsGenerator.setStartWithLastReceived();
  }
}
