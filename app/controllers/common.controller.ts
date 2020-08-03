import { NextFunction, Response, Request } from "express";
import { AuthUtil } from "../utils/auth.util";
import { CumtomResponse } from "../config/response";

export class CommonController {
    auth: AuthUtil;
    constructor() {
        this.auth = new AuthUtil();
    }

    authenticate = async (request: Request, response: Response, next: NextFunction) => {
        console.log(request.headers['authorization']);
        try {
            const user = this.auth.authenticate(request.headers['authorization']);
            request['user']  = user;
            next();
        } catch (err) {
            throw CumtomResponse.serverError(err, 'Error');
        }
    }
}