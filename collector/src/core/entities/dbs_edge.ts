import { Database } from './database';
import { Edge } from './edge';
import { Service } from './service';

export class DBSEdge extends Edge {
  constructor(private readonly db: Database, private readonly svc: Service, public readonly payload: any = null) {
    super(db, svc, payload);
  }

  get service(): Service {
    return this.svc;
  }

  get database(): Database {
    return this.db;
  }
}
