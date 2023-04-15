import express, { Request, Response, NextFunction } from "express";
import { User } from "../../models";
import { registerValidationSchema, validateRequestSchema } from "../../middleware/validations";
import { StatusCode, SuccessResponse } from "../../util/response";
import { DBConflictError } from "../../util/errors";
import { JWT } from "../../middleware/jwt";

const router = express.Router()


router.post('/',
    registerValidationSchema,
    validateRequestSchema,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, email, password } = req.body
            const user = await User.find({ $or: [{ username: username }, { email: email }] }).lean()
            if (user.length <= 0) {
                const saveduser = await User.build({ email: email, username: username, password: password, verified: false, verificatonCode: null }).save()
                return new SuccessResponse(res, {
                    data: {
                        username: saveduser.username, email: saveduser.email,
                        accesstoken: JWT.getNewAccessToken({
                            user: { _id: saveduser._id, username: saveduser.username },
                            salt: process.env.JWT_ACCESS_TOKEN_SALT!, jwtExpiry: null
                        }),
                        refreshtoken: JWT.getNewRefreshToken({
                            user: { _id: saveduser._id, username: saveduser.username },
                            salt: process.env.JWT_REFRESH_TOKEN_SALT!, jwtExpiry: null
                        })
                    },
                    message: "added", statuscode: StatusCode._201
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