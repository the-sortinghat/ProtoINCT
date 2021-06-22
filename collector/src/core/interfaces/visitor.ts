import { Database } from '../entities/database';
import { Edge } from '../entities/edge';
import { Graph } from '../entities/graph';
import { Service } from '../entities/service';

export interface Visitor {
  visitGraph: (g: Graph) => void;
  visitService: (s: Service) => void;
  visitDatabase: (db: Database) => void;
  visitEdge: (e: Edge) => void;
}
