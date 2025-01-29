import cors from 'cors';
import express, { Request, Response, Router } from 'express';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';
import path from 'path';

interface Options {
  port: number;
  routes: Router;
  publicPath?: string;
}

export class Server {
  public readonly app = express();
  private readonly port: number;
  private readonly routes: Router;
  private readonly publicPath: string;

  constructor(options: Options) {
    const { port, routes, publicPath = 'public' } = options;

    this.port = port;
    this.routes = routes;
    this.publicPath = publicPath;
  }

  async start() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan('dev'));

    this.app.use(
      cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
        credentials: true,
      })
    );

    this.app.use('/api/v1', this.routes);
    this.app.get('/api/v1/health', (req: Request, res: Response) => res.status(200).send({ status: 'OK' }));

    this.app.listen(this.port, () => {
      console.log(`Server running on port: ${this.port}`);
    });
  }
}
