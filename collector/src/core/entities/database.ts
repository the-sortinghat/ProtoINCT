import { DatabaseInterface } from '../interfaces';
import { Visitor } from '../interfaces/visitor';
import { Vertex } from './vertex';

export class Database extends Vertex implements DatabaseInterface {
  constructor(public readonly name: string, public readonly dbMake: string, public readonly dbModel: string) {
    super();
  }

  accept(v: Visitor): void {
    v.visitDatabase(this);
  }
}
