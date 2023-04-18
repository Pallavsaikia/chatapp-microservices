import express, { Request, Response, NextFunction } from "express";
import { Otp, User } from "../../models";
import { registerValidationSchema, validateRequestSchema } from "../../middleware/validations";
import { StatusCode, SuccessResponse } from "../../util/response";
import { DBConflictError } from "../../util/errors";
import { OTPServices } from "../../util/otp/libs/otp-gen";
import { sendEmail } from "../../util/email";
import { JWT } from "../../middleware/jwt-authentication";
import { UserRegistrationService } from "../../models/services";

const router = express.Router()


router.post('/',
    registerValidationSchema,
    validateRequestSchema,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, email, password } = req.body
            const user = await User.find({ $or: [{ username: username }, { email: email }] }).lean()
            if (user.length <= 0) {
                const otp = OTPServices.generateOTP()
                const saveduser = await UserRegistrationService({ email: email, username: username, password: password }, otp)
                sendEmail(otp, email)
                return new SuccessResponse(res, {
                    data: {
                        id:saveduser._id,
                        username: saveduser.username, email: saveduser.email,
                    },
                    message: "verify email", statuscode: StatusCode._201
                })
            }

            const dbConflictError = new DBConflictError([])

            if (user[0].username === username) {
                dbConflictError.push({ msg: "username already exists", param: "username" })
            }
            if (user[0].email === email) {
                dbConflictError.push({ msg: "email already exists", param: "email" })
            }
            return next(dbConflictError)
        } catch (e) {
            return next(new Error((e as Error).message))
        }
    })

export { router }