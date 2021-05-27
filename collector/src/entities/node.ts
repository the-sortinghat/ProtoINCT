import { Edge } from './edge';

export abstract class Node {
  protected _neighbors: Edge[];

  constructor() {
    this._neighbors = [];
  }

  get neighbors(): Edge[] {
    return this._neighbors;
  }

  addNeighbor(node: Node): void {
    const edge = new Edge(node);
    this._neighbors.push(edge);
  }
}
