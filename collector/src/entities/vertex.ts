export class Vertex {
  private static nextID = 0;
  private _id: number;

  constructor() {
    this._id = Vertex.nextID++;
  }

  get id(): number {
    return this._id;
  }

  compareTo(that: Vertex): number {
    return this.id - that.id;
  }
}
