import { NextFunction, Response, Request } from "express";
import { UserRepository } from "../repositories/user.repository";
import { CumtomResponse } from "../config/response";

export class UerController {
    userRepository: UserRepository;
    constructor() {
        this.userRepository = new UserRepository();
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
            const user = await this.userRepository.updateWithoutSet({ username: request.body.username }, request.body, { upsert: true });
            response.send(CumtomResponse.success(request.body, 'You joined'));
        } catch (error) {
            throw CumtomResponse.serverError(error, 'Error');
        }
    }
}