import { ID, Namespace, MaybeNamespace } from "./types.d";
import { Service } from "./service";

interface NamespaceServiceMapping {
  [namespace: string]: Service[];
}

export interface AttachedServices {
  namespaced: NamespaceServiceMapping;
  free: Service[];
}

export class Database {
  private _mappedServices: NamespaceServiceMapping;
  private _looseServices: Service[];

  constructor(
    public readonly model: string,
    public readonly make: string,
    public readonly id: ID
  ) {
    this._mappedServices = {};
    this._looseServices = [];
  }

  public addService(service: Service, namespace: MaybeNamespace = null): void {
    if (namespace) this.addServiceToNamespace(service, namespace);
    else this.addLooseService(service);
  }

  public get services(): AttachedServices {
    return {
      namespaced: this._mappedServices,
      free: this._looseServices,
    };
  }

  private addServiceToNamespace(service: Service, namespace: Namespace): void {
    if (!this._mappedServices[namespace]) {
      this._mappedServices[namespace] = [];
    }

    this._mappedServices[namespace].push(service);
  }

  private addLooseService(service: Service): void {
    this._looseServices.push(service);
  }
}
