import * as express from 'express';
import * as asyncHandler from 'express-async-handler';
import { ConversationController } from '../controllers/conversation.controller';
import { CommonController } from '../controllers/common.controller';

export class ConversationRoutes {
    router: express.Router;
    controller: ConversationController;
    commonController: CommonController;
    constructor() {
        this.router = express.Router();
        this.controller = new ConversationController();
        this.commonController = new CommonController();
    }
    get routes() {
        this.router.get('/', asyncHandler(this.commonController.authenticate), asyncHandler(this.controller.getRecord));
        this.router.get('/:id', asyncHandler(this.commonController.authenticate), asyncHandler(this.controller.getRecord));
        this.router.post('/', asyncHandler(this.commonController.authenticate), asyncHandler(this.controller.createRecord));
        return this.router;
    }
}