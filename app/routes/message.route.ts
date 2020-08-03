import * as express from 'express';
import * as asyncHandler from 'express-async-handler'
import { MessageController } from '../controllers/message.controller';
import { CommonController } from '../controllers/common.controller';
export class MessageRoutes {
    router: express.Router;
    controller: MessageController;
    commonController: CommonController;
    constructor() {
        this.router = express.Router();
        this.controller = new MessageController();
        this.commonController = new CommonController();
    }
    get routes() {
        this.router.get('/:conversationId', asyncHandler(this.commonController.authenticate), asyncHandler(this.controller.getRecord));
        this.router.post('/', asyncHandler(this.controller.createRecord));
        return this.router;
    }
}