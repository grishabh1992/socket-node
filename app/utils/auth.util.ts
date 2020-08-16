import { AppConfiguration } from "../app.constant";
import * as jwt from "jsonwebtoken";
import { CumtomResponse } from "../config/response";

export class AuthUtil {
    generateToken(info): string {
        return jwt.sign(
            { ...info },
            AppConfiguration.SECRET          
        );
    }

    authenticate = (token: string): any => {
        try {
            if (!token) {
                throw CumtomResponse.unAuthorised('Token is invalid.');
            };
            return jwt.verify(token, AppConfiguration.SECRET);
        }
        catch (err) {
            if (err && (err.name == 'TokenExpiredError')) {
                throw CumtomResponse.unAuthorised('Token is expired');
            } else if (err) {
                throw CumtomResponse.unAuthorised('Token is invalid.');
            };
            throw err;
        }
    }
}