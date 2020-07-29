import * as express from 'express'
import { DemoRoutes } from './demo.route';
import { UserRoutes } from './user.route';
import { ConversationRoutes } from './conversation.route';
import { MessageRoutes } from './message.route';

const app = express();

export class AppRoutes {
  get routes() {
    app.use("/demo", new DemoRoutes().routes);
    app.use("/user", new UserRoutes().routes);
    app.use("/conversation", new ConversationRoutes().routes);
    app.use("/message", new MessageRoutes().routes);
    return app;
  }
}