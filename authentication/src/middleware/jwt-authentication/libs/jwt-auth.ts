import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWTTokenDoc } from "./schema/definations/jwt-decode-doc";
import { InvalidJWtTokenError, JWtTokenExpiryError } from "./errors/";
import { JWTTokenType } from "./schema";

export class JWTAuth {

    
    constructor(public salt: string) {}

    authFnMiddleware() {
        const salt = this.salt
        return function (req: Request, res: Response, next: NextFunction) {
            const token = req.headers['authorization']
            jwt.verify(token!, salt, async (err, dict) => {
                if (err) {
                    return next(new InvalidJWtTokenError([{ msg: "invalid token", param: "jwt access token" }]))
                } else {
                    const token_dict = dict as JWTTokenDoc
                    if (!token_dict.exp) {
                        return next(new InvalidJWtTokenError([{ msg: "invalid token", param: "jwt access token" }]))
                    }
                    if (token_dict.tokentype !== JWTTokenType.access) {
                        return next(new InvalidJWtTokenError([{ msg: "invalid token", param: "jwt access token" }]))
                    }
                    const dateTimeinMs = new Date().getTime()
                    if (dateTimeinMs > token_dict.exp) {
                        return next(new JWtTokenExpiryError([{ msg: "token expired", param: "jwt access token" }]))
                    }

                    res.locals.user = token_dict.id;
                    next();
                }

            })
        }
    }
}