import { Message } from 'node-nats-streaming';
import { DatabaseInterface, DatabaseUsageInterface, ServiceInterface } from '../../core/interfaces';
import { stan } from './stan';

export function setupListeners(): void {
  const replayAllOpts = stan.subscriptionOptions().setDeliverAllAvailable();

  const foundService = stan.subscribe('SERVICE_FOUND', replayAllOpts);
  const foundDatabase = stan.subscribe('DATABASE_FOUND', replayAllOpts);
  const foundDatabaseUsage = stan.subscribe('DATABASE_USAGE_FOUND', replayAllOpts);

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
