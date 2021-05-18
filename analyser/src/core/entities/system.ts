import { Database } from "./database";

export class System {
  private _databases: Database[];

  constructor(public readonly name: string) {
    this._databases = [];
  }

  public addDatabase(db: Database): void {
    this._databases.push(db);
  }

  public get databases(): Database[] {
    return this._databases;
  }
}
