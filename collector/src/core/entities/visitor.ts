import { Service } from '../entities/service';
import { Database } from '../entities/database';
import { System } from '../entities/system';

export interface Visitor {
  visitService: (s: Service) => void;
  visitDatabase: (db: Database) => void;
  visitSystem: (s: System) => void;
}
