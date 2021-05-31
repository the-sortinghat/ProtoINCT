import { Service } from '../entities/service';
import { Database } from '../entities/database';

export interface Visitor {
  visitService: (s: Service) => void;
  visitDataBase: (db: Database) => void;
}
