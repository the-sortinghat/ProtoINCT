import { Service } from "./service";

export class Database {
  private _services: Service[];

  constructor(
    public readonly model: string,
    public readonly make: string,
    public readonly namespace: string | undefined = undefined
  ) {
    this._services = [];
  }

  public addService(service: Service): void {
    this._services.push(service);
  }

  public get services(): Service[] {
    return this._services;
  }
}
