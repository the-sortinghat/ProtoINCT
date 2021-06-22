import { Edge } from '../edge';
import { Graph } from '../graph';
import { Service } from '../service';
import { Vertex } from '../vertex';
import { SendMessageInterface } from '../../interfaces/send_message';
import { Visitor } from '../../interfaces/visitor';
import { Database } from '../database';

export class FindServices implements Visitor {
  private graph: Graph | undefined = undefined;
  private visitedIds: number[] = [];

  constructor(private readonly sendMessage: SendMessageInterface) {}

  visitGraph(g: Graph): void {
    this.graph = g;
    this.visitedIds = [];
    this.graph.vertices.forEach((v: Vertex): void => v.accept(this));
  }

  visitService(s: Service): void {
    const alreadyVisited = this.alreadyVisited(s);

    if (!alreadyVisited) {
      this.visitedIds.push(s.id);

      this.sendMessage.serviceFound({ name: s.name });

      this.graph?.adj(s).forEach((e: Edge): void => e.accept(this));
    }
  }

  visitDatabase(db: Database): void {
    const alreadyVisited = this.alreadyVisited(db);

    if (!alreadyVisited) {
      this.visitedIds.push(db.id);
      this.graph?.adj(db).forEach((e: Edge): void => e.accept(this));
    }
  }

  visitEdge(e: Edge): void {
    const v = e.either();
    const w = e.other(v);

    const alreadyVisited = this.alreadyVisited(v) && this.alreadyVisited(w);

    if (!alreadyVisited) {
      v.accept(this);
      w.accept(this);
    }
  }

  private alreadyVisited(v: Vertex): boolean {
    return this.visitedIds.includes(v.id);
  }
}
