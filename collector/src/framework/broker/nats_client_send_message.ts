import { Stan } from 'node-nats-streaming';
import { ServiceInterface, DatabaseInterface, DatabaseUsageInterface } from '../../core/interfaces';
import { SendMessageInterface } from '../../core/interfaces/send_message';

export class NatsClientSendMensage implements SendMessageInterface {
  constructor(private readonly broker: Stan) {}

  serviceFound(s: ServiceInterface): void {
    this.broker.publish('new.service', JSON.stringify(s));
  }

  databaseFound(db: DatabaseInterface): void {
    this.broker.publish('new.database', JSON.stringify(db));
  }

  databaseUsageFound(dbUsage: DatabaseUsageInterface): void {
    this.broker.publish('new.database_usage', JSON.stringify(dbUsage));
  }
}
