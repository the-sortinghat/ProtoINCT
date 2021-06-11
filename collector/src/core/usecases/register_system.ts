import { ServiceInterface, DatabaseInterface } from '../interfaces';

const possibleDatabaseImages = [
  { dbMake: 'mongo', dbModel: 'NoSQL' },
  { dbMake: 'postgres', dbModel: 'Relational' },
  { dbMake: 'mysql', dbModel: 'Relational' },
  { dbMake: 'mariadb', dbModel: 'Relational' },
  { dbMake: 'redis', dbModel: 'Key-Value' },
  { dbMake: 'neo4j', dbModel: 'Graph' },
];

export class RegisterSystem {
  static async run(repoURL: string, { http, yaml, SystemModel }: any): Promise<any> {
    const rgx = /(?:https?:\/\/)?(?:www\.)?github\.com\/(.+)\/(.+)\/?/;
    const match = repoURL.match(rgx);
    const userOrOrgName = match ? match[1] : '';
    const repoName = match ? match[2] : '';

    const url = `https://raw.githubusercontent.com/${userOrOrgName}/${repoName}/main/docker-compose.yaml`;
    const response = await http.get(url);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { services } = yaml.load(response.data) as any;

    const databases = Object.keys(services)
      .filter((container) => {
        const { image } = services[container];
        return image && possibleDatabaseImages.some((db) => image.includes(db.dbMake));
      })
      .map((container) => {
        const { image } = services[container];
        return possibleDatabaseImages.find((db) => image.includes(db.dbMake));
      }) as DatabaseInterface[];

    const systemServices = Object.keys(services)
      .filter((container) => {
        const { image } = services[container];
        return !image;
      })
      .map((container) => ({ name: container })) as ServiceInterface[];

    const system = new SystemModel({ name: repoName, services: systemServices, databases });

    return await system.save();
  }
}
