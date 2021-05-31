import {Visitor} from '../visitors/visitor';
import {Edge} from './edge';
import {Node} from './node';

export class Database extends Node {
  constructor() {
    super();
  }

  addNeighbor(node: Node, namespace: string | null = null): void {
    let edge: Edge;

    if (namespace) {
      edge = new Edge(node, {namespace});
    } else {
      edge = new Edge(node);
    }

    this._neighbors.push(edge);
  }

  accept(v: Visitor): void {
    v.visitDatabase(this);
  }
}
