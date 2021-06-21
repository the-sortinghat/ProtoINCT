import mongoose from 'mongoose';

const mongoHost = process.env.MONGO_HOST || 'localhost';
const mongoPort = process.env.MONGO_PORT || '27017';
const mongoUser = process.env.MONGO_INITDB_ROOT_USERNAME || 'root';
const mongoPass = process.env.MONGO_INITDB_ROOT_PASSWORD || 'root';
const mongoDb = process.env.MONGO_DATABASE || 'test';

const mongoUrl = `mongodb://${mongoUser}:${mongoPass}@${mongoHost}:${mongoPort}`;

export async function setupDatabaseConnection(): Promise<void> {
  try {
    await mongoose.connect(`${mongoUrl}/${mongoDb}?authSource=admin`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('- Database connected');
  } catch (error) {
    console.log('Error while connecting to database: ', error);
  }
}
