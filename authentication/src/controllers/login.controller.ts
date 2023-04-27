import { Request, Response, NextFunction } from "express";
import { StatusCode, SuccessResponse } from "../util/response";
import { authenticateUserService } from "../db-services";
import { Config } from "../config";
import { getJwtTokensWrapper } from "../util/wrappers";

export async function loginController(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body
    const { error, user, errorDescription } = await authenticateUserService({ username: username, password: password })
    if (error) {
        return next(errorDescription)
    }

    const asserUser = user!
    const { accessToken, refreshToken } = getJwtTokensWrapper(asserUser, Config.JWT_ACCESS_TOKEN_SALT, Config.JWT_REFRESH_TOKEN_SALT)

    return new SuccessResponse(res, {
        data: {
            id: asserUser._id,
            accessToken: accessToken,
            refreshToken: refreshToken,
            username: asserUser.username, email: asserUser.email,
        },
        message: "successfully logged in", statuscode: StatusCode._200

        
    })

}