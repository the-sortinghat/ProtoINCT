import neo4j, { Driver, Record, Session } from "neo4j-driver";
import { Dataservice } from "../logic/dataservice.interface";

export class Neo4jDataservice implements Dataservice {
  private driver: Driver;

  constructor(url: string, user: string, pw: string) {
    this.driver = neo4j.driver(url, neo4j.auth.basic(user, pw));
  }

  async createSystem(name: string): Promise<void> {
    const query = `CREATE (:System { name:$name })`;
    const params = { name };
    await this.run(query, params);
  }

  async createService(serviceName: string, systemName: string): Promise<void> {
    const query = `
      MATCH (sys:System { name:$systemName })
      CREATE (:Service { name:$serviceName })-[:BELONGS_TO]->(sys)
    `;
    const params = { systemName, serviceName };
    await this.run(query, params);
  }

  async createDatabase(dbName: string, systemName: string): Promise<void> {
    const query = `
      MATCH (sys:System { name:$systemName })
      CREATE (:Database { name:$databaseName })-[:BELONGS_TO]->(sys)
    `;
    const params = { databaseName: dbName, systemName };

    await this.run(query, params);
  }

  async createDatabaseUsage(
    dbName: string,
    svcName: string,
    sysName: string,
    ns: string | null = null
  ): Promise<void> {
    const query = `
      MATCH
      (sys:System { name:$sysName }),
      (svc:Service { name:$svcName })-[:BELONGS_TO]->(sys),
      (db:Database { name:$dbName })-[:BELONGS_TO]->(sys)
      CREATE (svc)-[:USES { namespace:$ns }]->(db)
    `;
    const params = { sysName, svcName, dbName, ns };
    this.run(query, params);
  }

  async getDBperService(systemName: string): Promise<any> {
    const query = `
      MATCH (db:Database)<-[r:USES]-(svc:Service)-[:BELONGS_TO]->(:System {name:$systemName})
      WITH COUNT(svc) AS nSvcs, COLLECT(svc) AS svcs, db AS exclusiveDB
      WHERE nSvcs < 2
      RETURN exclusiveDB, nSvcs, svcs
    `;
    const params = { systemName };
    const { records } = await this.run(query, params);

    if (records.length === 0) return null;

    return records.map((record: Record) => {
      const db = record.get("exclusiveDB").properties;
      const svc = record.get("svcs")[0].properties;

      return { db, svc };
    });
  }

  disconnect(): void {
    this.driver.close();
  }

  private async run(query: string, params: any): Promise<any> {
    const session: Session = this.driver.session({ database: "neo4j" });
    try {
      return await session.run(query, params);
    } catch (e) {
      console.log(e);
    } finally {
      session.close();
    }
  }
}
