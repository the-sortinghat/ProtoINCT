import express from 'express';
import yaml from 'js-yaml';
import axios from 'axios';
import { DatabaseInterface, DatabaseModel } from './database/schema';
import { setupDatabaseConnection } from './database/connection';

const possibleDatabaseImages = [
  { dbMake: 'mongo', dbModel: 'NoSQL' },
  { dbMake: 'postgres', dbModel: 'Relational' },
  { dbMake: 'mysql', dbModel: 'Relational' },
  { dbMake: 'mariadb', dbModel: 'Relational' },
  { dbMake: 'redis', dbModel: 'Key-Value' },
  { dbMake: 'neo4j', dbModel: 'graph' },
];

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.get('/', (_, res) => res.status(200).json({ message: 'Hello' }));

app.post('/register', async (req, res) => {
  const { repoURL } = req.body;
  const rgx = /(?:https?:\/\/)?(?:www\.)?github\.com\/(.+)\/(.+)\/?/;
  const match = repoURL.match(rgx);
  const userOrOrgName = match[1];
  const repoName = match[2];

  const url = `https://raw.githubusercontent.com/${userOrOrgName}/${repoName}/main/docker-compose.yaml`;
  const response = await axios.get(url);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { services } = yaml.load(response.data) as any;

  const databases = Object.keys(services)
    .filter((container) => {
      const { image } = services[container];
      return image && possibleDatabaseImages.some((db) => image.includes(db.dbMake));
    })
    .map((container) => {
      const { image } = services[container];
      return possibleDatabaseImages.find((db) => image.includes(db.dbMake));
    }) as DatabaseInterface[];

  await DatabaseModel.insertMany(databases);

  const resultDBs = await DatabaseModel.find();

  return res.json({ userOrOrgName, repoName, databases: resultDBs });
});

app.listen(port, () => {
  console.log('Collector is running!');
  setupDatabaseConnection();
});
