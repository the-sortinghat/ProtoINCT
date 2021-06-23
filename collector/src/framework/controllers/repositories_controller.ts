import express from 'express';
import axios from 'axios';
import yaml from 'js-yaml';

import { RegisterSystem } from '../../core/usecases/register_system';

class SystemModel {
  constructor(private readonly sys: any) {}

  save(): Promise<any> {
    console.log('system saved');
    return new Promise((resolve) => resolve(this.sys));
  }
}

export class RepositoriesController {
  static async register(req: express.Request, res: express.Response): Promise<void> {
    const { repoURL } = req.body;

    const dependencies = {
      http: axios,
      yaml,
      SystemModel,
    };

    const savedSystem = await RegisterSystem.run(repoURL, dependencies);

    res.json(savedSystem);
  }
}
