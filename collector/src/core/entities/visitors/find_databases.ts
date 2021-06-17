import { Database } from '../database';
import { Edge } from '../edge';
import { Graph } from '../graph';
import { Vertex } from '../vertex';
import { SendMessageInterface } from '../../interfaces/send_message';
import { Visitor } from '../../interfaces/visitor';
import { Service } from '../service';

export class FindDatabases implements Visitor {
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
      this.graph?.adj(s).forEach((e: Edge): void => e.accept(this));
    }
  }

  visitDatabase(db: Database): void {
    const alreadyVisited = this.alreadyVisited(db);

    if (!alreadyVisited) {
      this.visitedIds.push(db.id);

      const { dbMake, dbModel } = db;
      this.sendMessage.databaseFound({ dbMake, dbModel });

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
