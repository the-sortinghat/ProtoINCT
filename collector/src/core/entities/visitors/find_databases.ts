import { Database } from '../database';
import { Edge } from '../edge';
import { Graph } from '../graph';
import { Vertex } from '../vertex';
import { SendMessageInterface } from '../../interfaces/send_message';
import { Visitor } from '../../interfaces/visitor';

export class FindDatabases implements Visitor {
  private graph: Graph | undefined = undefined;
  private visitedIds: number[] = [];

  constructor(private readonly sendMessage: SendMessageInterface) {}

  visitGraph(g: Graph): void {
    this.graph = g;
    this.visitedIds = [];
    this.graph.vertices.forEach((v: Vertex): void => v.accept(this));
  }

  visitVertex(v: Vertex): void {
    const alreadyVisited = this.visitedIds.includes(v.id);

    if (!alreadyVisited) {
      this.visitedIds.push(v.id);

      if (v instanceof Database) {
        const { dbMake, dbModel } = v as Database;
        this.sendMessage.databaseFound({ dbMake, dbModel });
      }

      this.graph?.adj(v).forEach((e: Edge): void => e.accept(this));
    }
  }

  visitEdge(e: Edge): void {
    const v = e.either();
    const w = e.other(v);

    v.accept(this);
    w.accept(this);
  }
}
