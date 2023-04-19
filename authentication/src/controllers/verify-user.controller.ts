import { Request, Response, NextFunction } from "express";
import { StatusCode, SuccessResponse } from "../util/response";
import { validateUserOtpSercive } from "../db-services";

export async function verifyUserController(req: Request, res: Response, next: NextFunction) {
    const { userid, otp } = req.body

    const { valid, error } = await validateUserOtpSercive(userid, otp)
    if (!valid) {
        return next(error)
    }
    return new SuccessResponse(res, {
        data: null,
        message: "successfully verified", statuscode: StatusCode.accepted
    })


}