import { Schema, model } from 'mongoose';

import { SystemInterface } from '../../core/interfaces';

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
