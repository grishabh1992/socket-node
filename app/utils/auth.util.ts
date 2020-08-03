import { AppConfiguration } from "../app.constant";
import * as jwt from "jsonwebtoken";
import { CumtomResponse } from "../config/response";

export class AuthUtil {
    generateToken(info): string {
        return jwt.sign(
            { ...info },
            AppConfiguration.SECRET,
            { expiresIn: 60 *60 }
        );
    }

    authenticate = (token: string): any => {
        try {
            if (!token) {
                throw CumtomResponse.unAuthorised('Token is invalid.');
            };
            // jwt.verify(token, AppConfiguration.SECRET, (err, decodedToken) => {
            //     if (err && (err.name == 'TokenExpiredError')) {
            //         throw CumtomResponse.unAuthorised('Token is expired');
            //     } else if (err) {
            //         throw CumtomResponse.unAuthorised('Token is invalid.');
            //     };
            //     return { ...decodedToken };
            // });
            return jwt.verify(token, AppConfiguration.SECRET);
        }
        catch (err) {
            console.log(err, 'authi')
            if (err && (err.name == 'TokenExpiredError')) {
                throw CumtomResponse.unAuthorised('Token is expired');
            } else if (err) {
                throw CumtomResponse.unAuthorised('Token is invalid.');
            };
            throw err;
        }
    }
}