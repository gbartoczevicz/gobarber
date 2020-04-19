import 'reflect-metadata';

import express from 'express';

import routes from './routes';
import uploadConfig from './config/upload';

import './database';

class App {
  public server: express.Application;

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.server.use(express.json());
  }

  private routes(): void {
    this.server.use(routes);

    this.server.use('/files', express.static(uploadConfig.directory));
  }
}

export default new App().server;
