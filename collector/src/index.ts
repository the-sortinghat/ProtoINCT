import express from 'express';
import { setupDatabaseConnection } from './framework/database/connection';
import { RepositoriesController } from './framework/controllers/repositories_controller';

import { Service } from './core/entities/service';
import { Database } from './core/entities/database';
import { Edge } from './core/entities/edge';
import { Graph } from './core/entities/graph';

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.post('/register', RepositoriesController.register);

app.listen(port, () => {
  console.log('Collector is running!');

  const svc = new Service('foo');
  const db = new Database('MongoDB', 'document');

  const e = new Edge(svc, db, { namespace: 'foo' });

  const g = new Graph();

  g.addEdge(e);

  console.log(g);

  setupDatabaseConnection();
});
