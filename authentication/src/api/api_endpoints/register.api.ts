import express, { Request, Response, NextFunction } from "express";
import { registerValidationSchema, validateRequestSchema } from "../../middleware/validations";
import { StatusCode, SuccessResponse } from "../../util/response";
import { DBConflictError } from "../../middleware/error-handlers";
import { OTPGenerator } from "../../util/otp/libs/otp-gen";
import { sendEmail } from "../../util/email";
import { UserRegistrationService, IsUserNameOrEmailAvailableService } from "../../models/services";

const router = express.Router()


router.post('/',
    registerValidationSchema,
    validateRequestSchema,
    async (req: Request, res: Response, next: NextFunction) => {

        const { username, email, password } = req.body
        const { available, user } = await IsUserNameOrEmailAvailableService({ username: username, email: email })
        if (available) {
            const otp = OTPGenerator.generateOTP()
            const saveduser = await UserRegistrationService({ email: email, username: username, password: password }, otp)
            sendEmail(otp, email)
            return new SuccessResponse(res, {
                data: {
                    id: saveduser._id,
                    username: saveduser.username, email: saveduser.email,
                },
                message: "created ,verify email to continue", statuscode: StatusCode._201
            })
        }

        const dbConflictError = new DBConflictError([])

        if (user!.username === username) {
            dbConflictError.push({ msg: "username already exists", param: "username" })
        }
        if (user!.email === email) {
            dbConflictError.push({ msg: "email already exists", param: "email" })
        }
        return next(dbConflictError)

    })

export { router }