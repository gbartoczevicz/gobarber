import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import 'express-async-errors';

import routes from '@shared/infra/http/routes';
import uploadConfig from '@config/upload';

import '@shared/infra/typeorm';
import AppError from '@shared/errors/AppError';

class App {
  public server: express.Application;

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  private middlewares(): void {
    this.server.use(cors());
    this.server.use(express.json());
  }

  private routes(): void {
    this.server.use(routes);

    this.server.use('/files', express.static(uploadConfig.directory));
  }

  private exceptionHandler(): void {
    this.server.use(
      async (err: Error, req: Request, res: Response, _: NextFunction) => {
        if (err instanceof AppError) {
          return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
          });
        }

        return res.status(500).json({
          status: 'error',
          message: 'Internal server error',
        });
      },
    );
  }
}

export default new App().server;