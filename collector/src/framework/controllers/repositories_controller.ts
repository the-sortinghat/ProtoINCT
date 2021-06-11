import express from 'express';
import axios from 'axios';
import yaml from 'js-yaml';
import { SystemModel } from '../../framework/database/schema';

import { RegisterSystem } from '../../core/usecases/register_system';

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
