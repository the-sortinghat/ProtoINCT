import neo4j, { Driver, Session } from "neo4j-driver";

const url = process.env.NEO4J_URL as string;
const user = process.env.NEO4J_USER as string;
const pw = process.env.NEO4J_PASSWORD as string;

interface ConnectionResults {
  session: Session;
  driver: Driver;
}

function connectNeo4j(): ConnectionResults {
  const driver = neo4j.driver(url, neo4j.auth.basic(user, pw), {});

  const session = driver.session({ database: "neo4j" });

  return { driver, session };
}

function disconnectNeo4j(session: Session, driver: Driver): void {
  session.close();
  driver.close();
}

export default {
  connect: connectNeo4j,
  disconnect: disconnectNeo4j,
};
