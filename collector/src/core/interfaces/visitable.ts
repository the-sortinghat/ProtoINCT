import { Visitor } from './visitor';

export interface Visitable {
  accept: (v: Visitor) => void;
}
