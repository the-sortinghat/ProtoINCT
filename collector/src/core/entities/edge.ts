import { Vertex } from './vertex';

export abstract class Edge {
  private static nextID = 0;
  private _id: number;

  constructor(private readonly v: Vertex, private readonly w: Vertex, public readonly payload: any = null) {
    this._id = Edge.nextID++;
  }

  get id(): number {
    return this._id;
  }

  either(): Vertex {
    return this.v;
  }

  other(v: Vertex): Vertex {
    return v.id === this.v.id ? this.w : this.v;
  }

  compareTo(that: Edge): number {
    return this.id - that.id;
  }
}
