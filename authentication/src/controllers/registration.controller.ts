import { Request, Response, NextFunction } from "express";
import { SuccessResponse,StatusCode } from "@pschatapp/response";
import { OTPGenerator } from "../util/otp";
import { sendEmail } from "../util/email";
import { userRegistrationService, isUserNameOrEmailAvailableService } from "../db-services";
import { OtpMetaData } from "../config";

export async function registerUserController(req: Request, res: Response, next: NextFunction) {
    const { username, email, password } = req.body
    const { error, user, errorDescription } = await isUserNameOrEmailAvailableService({ username: username, email: email })
    if (error) {
        return next(errorDescription)
    }
    const otp = OTPGenerator.generateOTP(OtpMetaData.OTP_LENGTH)
    const saveduser = await userRegistrationService({ email: email, username: username, password: password }, otp)
    sendEmail(otp, email)



    return new SuccessResponse(res, {
        data: {
            id: saveduser._id,
            username: saveduser.username, email: saveduser.email,
        },
        message: "created ,verify email to continue", statuscode: StatusCode._201
    })

}