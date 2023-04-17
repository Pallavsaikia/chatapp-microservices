import express, { Request, Response, NextFunction } from "express";
import { verifyUserValidationSchema, validateRequestSchema } from "../../middleware/validations";
import { StatusCode, SuccessResponse } from "../../util/response";
import { ValidateUserOtpSercive } from "../../models/services";

const router = express.Router()


router.post('/',
    verifyUserValidationSchema,
    validateRequestSchema,
    async (req: Request, res: Response, next: NextFunction) => {
        const { userid, otp } = req.body
        try {
            const { valid, error } = await ValidateUserOtpSercive(userid, otp)
            if (!valid) {
                return next(error)
            }
            return new SuccessResponse(res, {
                data: null,
                message: "successfully verified", statuscode: StatusCode._200
            })

        } catch (e) {
            return next(new Error((e as Error).message))
        }
    })

export { router }