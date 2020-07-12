import * as express from 'express'
import { AppRoutes } from './routes';
import bodyParser = require('body-parser');
import * as cors from 'cors';

class App {
  public express : express.Application;

  constructor () {
    this.express = express();
    this.mountRoutes();    
  }

  private mountRoutes (): void {
    this.express.use(cors())
    this.express.use(bodyParser.json());
    this.express.use(new AppRoutes().routes);
  }
}

module.exports = new App().express;