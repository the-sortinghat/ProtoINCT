import { ServiceInterface } from '../interfaces';
import { Vertex } from './vertex';

export class Service extends Vertex implements ServiceInterface {
  constructor(public readonly name: string) {
    super();
  }
}
