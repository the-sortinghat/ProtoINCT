import { ServiceInterface, DatabaseInterface, SystemInterface } from '../interfaces';

export class RegisterSystem {
  static dockerComposeServices: Promise<any>;
  static systemServices: any;
  static databases: any;
  static system: any;

  static async run(repoURL: string, { http, yaml, SystemModel }: any): Promise<any> {
    this.dockerComposeServices = await this.getDockerComposeAndParse(repoURL, { http, yaml });
    this.systemServices = this.getServices(this.dockerComposeServices);
    this.databases = this.getDatabases(this.dockerComposeServices);
    this.system = this.getSystem(this.dockerComposeServices, repoURL, { http });

    // const system = new SystemModel({ name: repoName, services: systemServices, databases });

    // return await system.save();
    return false;
  }

  private static async getDockerComposeAndParse(repoURL: string, { http, yaml }: any) {
    const rgx = /(?:https?:\/\/)?(?:www\.)?github\.com\/(.+)\/(.+)\/?/;
    const match = repoURL.match(rgx);
    const userOrOrgName = match ? match[1] : '';
    const repoName = match ? match[2] : '';

    // const url = `https://raw.githubusercontent.com/${userOrOrgName}/${repoName}/main/docker-compose.yaml`;
    const url = `https://raw.githubusercontent.com/${userOrOrgName}/${repoName}/collector/docker-compose.yaml`;

    const response = await http.get(url);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { services } = yaml.load(response.data) as any;

    return services;
  }

  private static getServices(obj: any) {
    const systemServices = Object.keys(obj)
      .filter((container) => {
        const { build } = obj[container];
        return build;
      })
      .map((container) => ({ name: container })) as ServiceInterface[];

    return systemServices;
  }

  private static getDatabases(obj: any) {
    const databases = Object.keys(obj)
      .filter((container) => {
        const { image } = obj[container];
        if (image) {
          const rgxMongo = /^(?:mongo:)/;
          const match = image.match(rgxMongo);
          if (match) {
            return image;
          }
        }
      })
      .map((container) => ({ name: container, dbModel: 'NoSQL', dbMake: 'MongoDB' })) as DatabaseInterface[];

    return databases;
  }

  private static getSystem(obj: any, repoURL: string, { http }: any) {
    const servicesWithEnvFile = Object.keys(obj)
      .filter((container) => {
        return obj[container].build && obj[container].env_file;
      })
      .map((container) => ({ name: container, env_file: obj[container].env_file }));

    console.log(servicesWithEnvFile);

    // fazer requisição e capturar o env_file
    const envFiles = servicesWithEnvFile.forEach((container) => {
      const rgx = /(?:https?:\/\/)?(?:www\.)?github\.com\/(.+)\/(.+)\/?/;
      const match = repoURL.match(rgx);
      const userOrOrgName = match ? match[1] : '';
      const repoName = match ? match[2] : '';

      const dirEnvFile = container.env_file[0].replace('./', '');

      const urlEnvFile = `https://raw.githubusercontent.com/${userOrOrgName}/${repoName}main/${dirEnvFile}`;

      // colocar condição ou try catch para erro?
      // const response = http.get(urlEnvFile);

      const response = {};

      // verificar string de conexão do mongo com regex
    });

    return servicesWithEnvFile;
  }
}
