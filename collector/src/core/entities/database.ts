import {DatabaseInterface} from '../interfaces';
import {Vertex} from './vertex';

export class Database extends Vertex implements DatabaseInterface {
  constructor(public readonly name: string, public readonly dbMake: string, public readonly dbModel: string) {
    super();
  }
}
