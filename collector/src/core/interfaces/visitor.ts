import { Edge } from '../entities/edge';
import { Graph } from '../entities/graph';
import { Vertex } from '../entities/vertex';

export interface Visitor {
  visitGraph: (g: Graph) => void;
  visitVertex: (v: Vertex) => void;
  visitEdge: (e: Edge) => void;
}
