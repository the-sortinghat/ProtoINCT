import { Edge } from './edge';
import { Vertex } from './vertex';

export class Graph {
  private _V = 0;
  private _E = 0;
  private _adj: Edge[][] = [];
  private _vertices: Vertex[] = [];

  get V(): number {
    return this._V;
  }

  get E(): number {
    return this._E;
  }

  get vertices(): Vertex[] {
    return Object.assign([], this._vertices);
  }

  addVertex(v: Vertex): void {
    if (!this._vertices.includes(v)) {
      this._vertices.push(v);
      this._V++;
      this._adj[v.id] = [];
    }
  }

  addEdge(e: Edge): void {
    const v = e.either();
    const w = e.other(v);

    this.addVertex(v);
    this.addVertex(w);

    this._adj[v.id].push(e);
    this._adj[w.id].push(e);

    this._E++;
  }

  adj(v: Vertex): Edge[] {
    return Object.assign([], this._adj[v.id]);
  }

  get edges(): Edge[] {
    const edges: Edge[] = [];

    for (const v of this._vertices) {
      let selfLoops = 0;

      for (const e of this.adj(v)) {
        if (e.other(v).compareTo(v) > 0) {
          edges.push(e);
        } else if (e.other(v).compareTo(v) === 0) {
          if (selfLoops % 2 === 0) edges.push(e);
          selfLoops++;
        }
      }
    }

    return edges;
  }
}
