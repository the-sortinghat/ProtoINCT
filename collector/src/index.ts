import express from 'express';
import yaml from 'js-yaml';
import axios from 'axios';

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
  const dockerCompose = yaml.load(response.data) as any;

  return res.json({ userOrOrgName, repoName, brokerImage: dockerCompose.services.broker.image });
});

app.listen(port, () => {
  console.log('Collector is running!');
});
