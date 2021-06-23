import { MongoClient } from 'mongodb';

const defaultUri = 'mongodb://test@test@localhost:27017/test';
const mongoUri = process.env.MONGO_URI || defaultUri;

export async function setupDatabaseConnection(): Promise<void> {
  try {
    const client = new MongoClient(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    console.log('- database connected');
  } catch (error) {
    console.log('- error while connecting to database: ', error);
  }
}
