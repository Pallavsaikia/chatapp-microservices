import { Request, Response, NextFunction } from "express";
import { StatusCode, SuccessResponse } from "../util/response";
import { validateUserOtpSercive } from "../db-services";
import { UserVerifiedEventPublisher, rabbitMQ } from "../messaging";

export async function verifyUserController(req: Request, res: Response, next: NextFunction) {
    const { userid, otp } = req.body

    const { valid, user, error } = await validateUserOtpSercive(userid, otp)
    if (!valid) {
        return next(error)
    }

    if (rabbitMQ.clientExist) {
        try{
            new UserVerifiedEventPublisher().publish(user!)
        }catch(e){
            console.log(e)
        }
     
    }

    return new SuccessResponse(res, {
        data: null,
        message: "successfully verified", statuscode: StatusCode.accepted
    })


}