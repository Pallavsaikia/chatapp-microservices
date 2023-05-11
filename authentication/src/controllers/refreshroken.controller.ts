import { Request, Response, NextFunction } from "express";
import { StatusCode, SuccessResponse } from "../util/response";
import {  checkUserExistByIDAndUserName } from "../db-services";
import { Config } from "../config";
import jwt from "jsonwebtoken";
import { getJwtTokensWrapper } from "../util/wrappers";
import { InvalidJWtTokenError, JWTTokenDoc, JWTTokenType, JWtTokenExpiryError } from "../middleware/jwt-authentication";

export async function refreshTokenController(req: Request, res: Response, next: NextFunction){
    const token: string = req.body.refreshtoken
    jwt.verify(token!, Config.JWT_REFRESH_TOKEN_SALT, async (err, dict) => {
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
                const { accessToken } = getJwtTokensWrapper(asserUser, Config.JWT_ACCESS_TOKEN_SALT)

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