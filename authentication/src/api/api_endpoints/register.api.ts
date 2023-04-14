import express, { Request, Response, NextFunction } from "express";
import { User } from "../../models";
import { registerValidationSchema, validateRequestSchema } from "../../middleware/validations";

const router = express.Router()

router.post('/',
    registerValidationSchema,
    validateRequestSchema,
    (req: Request, res: Response, next: NextFunction) => {

        res.send("test")
    })

export { router }