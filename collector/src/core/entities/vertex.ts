import { Visitable } from '../interfaces/visitable';
import { Visitor } from '../interfaces/visitor';

export abstract class Vertex implements Visitable {
  private static nextID = 0;
  protected _id: number;

  constructor() {
    this._id = Vertex.nextID++;
  }

  get id(): number {
    return this._id;
  }

  compareTo(that: Vertex): number {
    return this.id - that.id;
  }

  abstract accept(v: Visitor): void;
}
