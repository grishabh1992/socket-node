import * as express from 'express'
import { AppRoutes } from './routes';
import bodyParser = require('body-parser');
import * as cors from 'cors';
import { SERVER_ERROR } from './config/response';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    this.express.use(cors())
    this.express.use(bodyParser.json());
    this.express.use(new AppRoutes().routes);
    this.express.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.log(err);
      if (err.code) {
        res.status(err.code).json({
          data: err.data,
          message: err.message
        });
      } else {
        res.status(SERVER_ERROR[500]).json({ data: err, message: 'Unhandelled Exception' });
      }
    });
  }
}

module.exports = new App().express;