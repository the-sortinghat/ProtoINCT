import { Database } from '../entities/database';
import { Service } from '../entities/service';
import { Visitor } from './visitor';

export class PrintVisitor implements Visitor {
  visitService(s: Service): void {
    console.log('Este é um serviço. ');
    console.log(s);
  }

  visitDatabase(db: Database): void {
    console.log('Este é um banco de dados. ');
    console.log(db);
  }

  visitSystem(): void {
    return;
  }
}
