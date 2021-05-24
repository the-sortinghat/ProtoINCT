import { Schema, Document, model } from 'mongoose';

export interface ServiceInterface extends Document {
  name: string;
}

export interface DatabaseInterface extends Document {
  dbMake: string;
  dbModel: string;
}

export interface DatabaseUsageInterface extends Document {
  serviceID: string;
  databaseID: string;
  namespace: string;
}

const serviceSchema = new Schema(
  {
    name: String,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const databaseSchema = new Schema(
  {
    dbMake: String,
    dbModel: String,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const databaseUsageSchema = new Schema(
  {
    serviceID: String,
    databaseID: String,
    namespace: String,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const ServiceModel = model<ServiceInterface>('Service', serviceSchema);
const DatabaseModel = model<DatabaseInterface>('Database', databaseSchema);
const DatabaseUsageModel = model<DatabaseUsageInterface>('DatabaseUsage', databaseUsageSchema);

export { ServiceModel, DatabaseModel, DatabaseUsageModel };
