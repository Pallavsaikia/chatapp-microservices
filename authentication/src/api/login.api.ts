import express from "express";
import { handle } from "../middleware/error-handlers";
import { loginValidationSchema } from "../util/validation-schemas";
import { validateRequestSchema } from "../middleware/validations";
import { loginController } from "../controllers";

const router = express.Router()


router.post('/',
    loginValidationSchema,
    validateRequestSchema,
    handle(loginController))

export { router as loginApi }