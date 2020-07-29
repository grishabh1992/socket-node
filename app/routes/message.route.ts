import * as express from 'express';
import * as asyncHandler from 'express-async-handler'
import { MessageController } from '../controllers/message.controller';
export class MessageRoutes {
    router: express.Router;
    controller: MessageController;
    constructor() {
        this.router = express.Router();
        this.controller = new MessageController();
    }
    get routes() {
        this.router.get('/', asyncHandler(this.controller.getRecord));
        this.router.post('/', asyncHandler(this.controller.createRecord));
        return this.router;
    }
}