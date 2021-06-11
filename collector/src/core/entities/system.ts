import { Visitor } from '../visitors/visitor';
import { Edge } from './edge';
import { Node } from './node';

export class System extends Node {
  constructor(public readonly name: string) {
    super();
  }

  accept(v: Visitor): void {
    v.visitSystem(this);
    this._neighbors.forEach((neighbor: Edge): void => {
      const node = neighbor.node;
      node.accept(v);
    });
  }
}
