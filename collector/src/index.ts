import express from 'express';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.get('/', (_, res) => res.status(200).json({ message: 'Hello' }));

app.post('/register', (req, res) => {
  const { repoURL } = req.body;
  const rgx = /(?:https?:\/\/)?(?:www\.)?github\.com\/(.+)\/(.+)\/?/;
  const match = repoURL.match(rgx);

  const [_, userOrRepoName, repoName] = match;

  return res.json({ userOrRepoName, repoName });
});

app.listen(port, () => {
  console.log('Collector is running!');
  const filePath = path.resolve(__dirname, '..', 'test.yaml');
  const rawFile = fs.readFileSync(filePath).toString();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dockerCompose = yaml.load(rawFile) as any;
  console.log(dockerCompose.services.broker.image);
});
