import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWTTokenDoc } from "./schema/jwt-decode-doc";
import { InvalidJWtTokenError, JWtTokenExpiryError } from "./errors";
import { JWTTokenType } from "./schema";
import { checkUserExistByIDAndUserName } from "../../../db-services";
import { getJwtTokensWrapper } from "../../../util/wrappers";
import { StatusCode, SuccessResponse } from "../../../util/response";

export class JWTRefresh {


    constructor(public saltRefresh: string, public saltAccess: string) { }

    refreshMiddleware() {
        const saltRefresh = this.saltRefresh
        const saltAccess = this.saltAccess

        return function (req: Request, res: Response, next: NextFunction) {
            const token: string = req.body.refreshtoken

            jwt.verify(token!, saltRefresh, async (err, dict) => {
                if (err) {
                    return next(new InvalidJWtTokenError(
                        [{ msg: "invalid token", param: "jwt refresh token" }]
                    ))
                } else {
                    try {
                        const token_dict = dict as JWTTokenDoc
                        if (!token_dict.exp) {
                            return next(new InvalidJWtTokenError([{ msg: "invalid token", param: "jwt refresh token" }]))
                        }
                        if (token_dict.tokentype !== JWTTokenType.refresh) {
                            return next(new InvalidJWtTokenError(
                                [{ msg: "invalid token", param: "jwt refresh token" }]
                            ))
                        }
                        const dateTimeinMs = new Date().getTime()
                        if (dateTimeinMs > token_dict.exp) {
                            return next(new JWtTokenExpiryError([{ msg: "token expired", param: "jwt refresh token" }]))
                        }

                        const { error, user } = await checkUserExistByIDAndUserName({ _id: token_dict.id, username: token_dict.username })
                        if (error) {
                            return next(new InvalidJWtTokenError(
                                [{ msg: "invalid token", param: "jwt refresh token" }]
                            ))
                        }
                        const asserUser = user!
                        const { accessToken } = getJwtTokensWrapper(asserUser, saltAccess)

                        return new SuccessResponse(res, {
                            data: {
                                id: asserUser._id,
                                accessToken: accessToken,
                                username: asserUser.username, email: asserUser.email,
                            },
                            message: "successfully refreshed", statuscode: StatusCode._200
                        })
                    } catch (e) {
                        return next(new InvalidJWtTokenError(
                            [{ msg: "invalid token", param: "jwt refresh token" }]
                        ))
                    }

                }

            })
        }
    }
}