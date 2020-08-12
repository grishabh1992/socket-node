import { NextFunction, Response, Request } from "express";
import { UserRepository } from "../repositories/user.repository";
import { CumtomResponse } from "../config/response";
import { AuthUtil } from "../utils/auth.util";

export class UerController {
    userRepository: UserRepository;
    auth: AuthUtil;
    constructor() {
        this.userRepository = new UserRepository();
        this.auth = new AuthUtil();
    }

    getRecord = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const users = await this.userRepository.retrieve({}, {}, {});
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