import { Node } from './node';

export class System {
  private _graph: Node | undefined = undefined;

  constructor(public readonly name: string) {}

  get graph(): Node | undefined {
    return this._graph;
  }

  set graph(node: Node | undefined) {
    this._graph = node;
  }
}
