import express from 'express';

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.get('/', (_, res) => res.status(200).json({ message: 'Hello' }));

app.listen(port, () => {
  console.log('Collector is running!');
});
