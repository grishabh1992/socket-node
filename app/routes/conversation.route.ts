import * as express from 'express';
import * as asyncHandler from 'express-async-handler';
import { ConversationController } from '../controllers/conversation.controller';

export class ConversationRoutes {
    router: express.Router;
    controller: ConversationController;
    constructor() {
        this.router = express.Router();
        this.controller = new ConversationController();
    }
    get routes() {
        this.router.get('/', asyncHandler(this.controller.getRecord));
        this.router.get('/:id', asyncHandler(this.controller.getRecord));
        this.router.post('/', asyncHandler(this.controller.createRecord));
        return this.router;
    }
}