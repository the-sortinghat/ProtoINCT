import express from 'express';
import { stan } from './framework/broker/stan';
import { setupListeners } from './framework/broker/setup_listeners';
import { setupDatabaseConnection } from './framework/database/connection';
import { RepositoriesController } from './framework/controllers/repositories_controller';

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.post('/register', RepositoriesController.register);

async function bootstrap() {
  stan.on('connect', async () => {
    setupListeners();

    console.log('- Broker connected');

    await setupDatabaseConnection();

    app.listen(port, () => console.log('\n=== Collector is running! ===\n\n'));
  });
}

bootstrap().catch(console.dir);
