import { Message } from 'node-nats-streaming';
import { DatabaseInterface, DatabaseUsageInterface, ServiceInterface } from '../../core/interfaces';
import { stan } from './stan';

export function setupListeners(): void {
  const replayAllOpts = stan.subscriptionOptions().setDeliverAllAvailable();

  const foundService = stan.subscribe('new.service', replayAllOpts);
  const foundDatabase = stan.subscribe('new.database', replayAllOpts);
  const foundDatabaseUsage = stan.subscribe('new.database_usage', replayAllOpts);

  foundService.on('message', (msg: Message): void => {
    // register service
    const service: ServiceInterface = JSON.parse(msg.getData() as string);
    console.log(`service found: ${service}`);
  });

  foundDatabase.on('message', (msg: Message): void => {
    // register database
    const database: DatabaseInterface = JSON.parse(msg.getData() as string);
    console.log(`database found: ${database}`);
  });

  foundDatabaseUsage.on('message', (msg: Message): void => {
    // register database usage
    const databaseUsage: DatabaseUsageInterface = JSON.parse(msg.getData() as string);
    console.log(`database usage found: ${databaseUsage}`);
  });
}
