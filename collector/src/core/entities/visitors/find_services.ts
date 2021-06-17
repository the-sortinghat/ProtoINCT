import { Edge } from '../edge';
import { Graph } from '../graph';
import { Service } from '../service';
import { Vertex } from '../vertex';
import { SendMessageInterface } from '../../interfaces/send_message';
import { Visitor } from '../../interfaces/visitor';

export class FindServices implements Visitor {
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

      if (v instanceof Service) {
        const { name } = v as Service;
        this.sendMessage.serviceFound({ name });
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
