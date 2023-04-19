import express from "express";
import { loginController } from "../controllers";
import { handle } from "../middleware/error-handlers";
import { validateRequestSchema } from "../middleware/validations";
import { loginValidationSchema } from "../util/validation-schemas";


const router = express.Router()


router.post('/',
    loginValidationSchema,
    validateRequestSchema,
    handle(loginController))

export { router as loginApi }