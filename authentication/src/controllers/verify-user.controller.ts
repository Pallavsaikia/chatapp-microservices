import { Request, Response, NextFunction } from "express";
import { StatusCode, SuccessResponse } from "../util/response";
import { validateUserOtpSercive } from "../db-services";
import { RabbitMq } from "../messaging";

export async function verifyUserController(req: Request, res: Response, next: NextFunction) {
    const { userid, otp } = req.body

    const { valid, user, error } = await validateUserOtpSercive(userid, otp)
    if (!valid) {
        return next(error)
    }

    if (res.locals.rabbitmq instanceof RabbitMq) {
        const rabbitmq = res.locals.rabbitmq
        rabbitmq.sendMsg(JSON.stringify(user))
    }
    
    return new SuccessResponse(res, {
        data: null,
        message: "successfully verified", statuscode: StatusCode.accepted
    })


}