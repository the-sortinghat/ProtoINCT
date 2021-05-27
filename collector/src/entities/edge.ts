import { Node } from './node';

export class Edge {
  constructor(public readonly node: Node, public readonly payload: any = null) {}
}
