import express from 'express';
import { DatabaseConnection } from './framework/database/connection';
import { RepositoriesController } from './framework/controllers/repositories_controller';

import { Service } from './core/entities/service';
import { Database } from './core/entities/database';
import { Graph } from './core/entities/graph';
import { DBSEdge } from './core/entities/dbs_edge';

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.post('/register', RepositoriesController.register);

app.listen(port, async () => {
  console.log('Collector is running!');

  const svc = new Service('foo');
  const db = new Database('foo_db', 'MongoDB', 'document');

  const e = new DBSEdge(db, svc, { namespace: 'foo' });

  const g = new Graph();

  g.addEdge(e);

  console.log(g);

  await DatabaseConnection.connect();
});
