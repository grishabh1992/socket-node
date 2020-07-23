import * as express from 'express'
import { DemoRoutes } from './demo.route';
import { UserRoutes } from './user.route';
import { ConversationRoutes } from './conversation.route';

const app = express();

export class AppRoutes {
  get routes() {
    app.use("/demo", new DemoRoutes().routes);
    app.use("/user", new UserRoutes().routes);
    app.use("/conversation", new ConversationRoutes().routes)
    return app;
  }
}