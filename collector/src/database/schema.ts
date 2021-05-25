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

export interface SystemInterface extends Document {
  name: string;
  services: ServiceInterface[];
  databases: DatabaseInterface[];
  databaseUsage: DatabaseUsageInterface[];
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

const systemSchema = new Schema(
  {
    name: String,
    services: [serviceSchema],
    databases: [databaseSchema],
    databaseUsage: [databaseUsageSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const SystemModel = model<SystemInterface>('System', systemSchema);

export { SystemModel };
