import { NextFunction, Response, Request } from "express";
import { UserRepository } from "../repositories/user.repository";
import { CumtomResponse } from "../config/response";
import { AuthUtil } from "../utils/auth.util";
import { MongooseUtil } from "../utils/mongoose.util";

export class UerController {
    userRepository: UserRepository;
    mongooseUtil: MongooseUtil;
    auth: AuthUtil;
    constructor() {
        this.userRepository = new UserRepository();
        this.auth = new AuthUtil();
        this.mongooseUtil = new MongooseUtil();
    }

    getRecord = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const condition = {};
            if (!request.params.showMe) {
                condition["_id"] = { $ne: this.mongooseUtil.objectId(request['user']._id) };
            }
            const users = await this.userRepository.retrieve(condition, {}, {});
            response.send(CumtomResponse.success(users, 'User fetched'));
        } catch (error) {
            throw CumtomResponse.serverError(error, 'Error');
        }

    }

    joinMe = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = await this.userRepository.updateOne({ username: request.body.username.toLowerCase() }, request.body, { upsert: true, new: true });
            response.send(CumtomResponse.success({ ...user.toJSON(), token: this.auth.generateToken(user.toJSON()) }, 'You joined'));
        } catch (error) {
            throw CumtomResponse.serverError(error, 'Error');
        }
    }
}