import { Db, MongoClient } from 'mongodb';

const mongoDb = process.env.MONGO_DB || 'test';
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';

export class DatabaseConnection {
  private static client: MongoClient;

  public static async connect(): Promise<void> {
    if (!this.client) {
      try {
        this.client = new MongoClient(mongoUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        await this.client.connect();
        console.log('- database connected');
      } catch (error) {
        console.log('- error while connecting to database: ', error);
      }
    }
  }

  public static async getDb(): Promise<Db> {
    if (!this.client) {
      await this.connect();
    }

    return this.client.db(mongoDb);
  }
}
