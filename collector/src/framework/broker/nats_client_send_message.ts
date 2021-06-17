import { Stan } from 'node-nats-streaming';
import { ServiceInterface, DatabaseInterface, DatabaseUsageInterface } from '../../core/interfaces';
import { SendMessageInterface } from '../../core/interfaces/send_message';

export class NatsClientSendMensage implements SendMessageInterface {
  constructor(private readonly broker: Stan) {}

  serviceFound(s: ServiceInterface): void {
    this.broker.publish('SERVICE_FOUND', JSON.stringify(s));
  }

  databaseFound(db: DatabaseInterface): void {
    this.broker.publish('DATABASE_FOUND', JSON.stringify(db));
  }

  databaseUsageFound(dbUsage: DatabaseUsageInterface): void {
    this.broker.publish('DATABASE_USAGE_FOUND', JSON.stringify(dbUsage));
  }
}
