import * as express from 'express';
import * as asyncHandler from 'express-async-handler'
import { UerController } from '../controllers/user.controller';
import { CommonController } from '../controllers/common.controller';
export class UserRoutes {
    router: express.Router;
    controller: UerController;
    commonController: CommonController;
    constructor() {
        this.router = express.Router();
        this.controller = new UerController();
        this.commonController = new CommonController();
    }
    get routes() {
        this.router.get('/', asyncHandler(this.commonController.authenticate), asyncHandler(this.controller.getRecord));
        this.router.put('/', asyncHandler(this.controller.joinMe));
        return this.router;
    }
}