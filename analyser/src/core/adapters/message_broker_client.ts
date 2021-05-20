import { Message } from "../entities/types.d";

export interface MessageBrokerClientInterface {
  publish: (channel: string, message: Message) => void;
}
