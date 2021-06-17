import { ServiceInterface } from '../interfaces';
import { Visitor } from '../interfaces/visitor';
import { Vertex } from './vertex';

export class Service extends Vertex implements ServiceInterface {
  constructor(public readonly name: string) {
    super();
  }

  accept(v: Visitor): void {
    v.visitService(this);
  }
}
