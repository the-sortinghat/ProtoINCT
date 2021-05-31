import { Node } from './node';

export class System extends Node {
  private _graph: Node | undefined = undefined;

  constructor(public readonly name: string) {
    super();
  }

  get graph(): Node | undefined {
    return this._graph;
  }

  set graph(node: Node | undefined) {
    this._graph = node;
  }
}
