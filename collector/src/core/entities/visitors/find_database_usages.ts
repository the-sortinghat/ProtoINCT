import { Database } from '../database';
import { Edge } from '../edge';
import { Graph } from '../graph';
import { Service } from '../service';
import { Vertex } from '../vertex';
import { SendMessageInterface } from '../../interfaces/send_message';
import { Visitor } from '../../interfaces/visitor';

export class FindDatabaseUsages implements Visitor {
  private graph: Graph | undefined = undefined;
  private visitedIds: number[] = [];

  constructor(private readonly sendMessage: SendMessageInterface) {}

  visitGraph(g: Graph): void {
    this.graph = g;
    this.visitedIds = [];
    this.graph.edges.forEach((e: Edge): void => e.accept(this));
  }

  visitVertex(v: Vertex): void {
    this.graph?.adj(v).forEach((e: Edge): void => e.accept(this));
  }

  visitEdge(e: Edge): void {
    const alreadyVisited = this.visitedIds.includes(e.id);

    if (!alreadyVisited) {
      this.visitedIds.push(e.id);

      const v = e.either();
      const w = e.other(v);

      let service: Service | undefined = undefined;
      let database: Database | undefined = undefined;

      if (v instanceof Service && w instanceof Database) {
        service = v as Service;
        database = w as Database;
      } else if (v instanceof Database && w instanceof Service) {
        service = w as Service;
        database = v as Database;
      }

      if (service && database) {
        this.sendMessage.databaseUsageFound({
          serviceID: service.id.toString(),
          databaseID: database.id.toString(),
          namespace: e.payload.namespace,
        });
      }

      v.accept(this);
      w.accept(this);
    }
  }
}
