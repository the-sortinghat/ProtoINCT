import { Database } from '../database';
import { Edge } from '../edge';
import { Graph } from '../graph';
import { Service } from '../service';
import { FindDatabases } from './find_databases';
import { FindDatabaseUsages } from './find_database_usages';
import { FindServices } from './find_services';

const MockBrokerSendMessage = jest.fn(() => ({
  serviceFound: jest.fn(),
  databaseFound: jest.fn(),
  databaseUsageFound: jest.fn(),
}));

describe('visitors', () => {
  let graph: Graph;

  beforeAll(() => {
    graph = new Graph();

    const serviceA = new Service('resource-adaptor');
    const serviceB = new Service('resource-discovery');
    const serviceC = new Service('data-collector');

    const databaseA = new Database('postgres', 'relational');
    const databaseB = new Database('mongo', 'nosql');
    const databaseC = new Database('mysql', 'relational');

    graph.addEdge(new Edge(serviceA, databaseA, { namespace: 'resource-adaptor-db' }));
    graph.addEdge(new Edge(serviceB, databaseB, { namespace: 'resource-discovery-db' }));
    graph.addEdge(new Edge(serviceC, databaseC, { namespace: 'data-collector-db' }));

    graph.addEdge(new Edge(serviceA, serviceB)); // this edge will not be counted as a database usage
  });

  describe('FindServices', () => {
    it('sends every service found in the graph to the message broker', () => {
      const mockBrokerSendMessage = new MockBrokerSendMessage();
      graph.accept(new FindServices(mockBrokerSendMessage));
      expect(mockBrokerSendMessage.serviceFound).toBeCalledTimes(3);
    });
  });

  describe('FindDatabases', () => {
    it('sends every database found in the graph to the message broker', () => {
      const mockBrokerSendMessage = new MockBrokerSendMessage();
      graph.accept(new FindDatabases(mockBrokerSendMessage));
      expect(mockBrokerSendMessage.databaseFound).toBeCalledTimes(3);
    });
  });

  describe('FindDatabaseUsages', () => {
    it('sends every database usage found in the graph to the message broker', () => {
      const mockBrokerSendMessage = new MockBrokerSendMessage();
      graph.accept(new FindDatabaseUsages(mockBrokerSendMessage));
      expect(mockBrokerSendMessage.databaseUsageFound).toBeCalledTimes(3);
    });
  });
});
