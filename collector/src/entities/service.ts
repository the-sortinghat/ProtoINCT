import { Visitor } from '../visitors/visitor';
import { Node } from './node';

export class Service extends Node {
  constructor() {
    super();
  }

  accept(v: Visitor): void {
    v.visitService(this);
  }
}
