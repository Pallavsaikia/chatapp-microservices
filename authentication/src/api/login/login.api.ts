import express from "express";
import { handle } from "../../middleware/error-handlers";
import { validateRequestSchema } from "../../middleware/validations";
import { loginValidationSchema } from "../../util/validation-schemas";
import { loginController } from "../../controllers/login";

const router = express.Router()


router.post('/',
    loginValidationSchema,
    validateRequestSchema,
    handle(loginController))

export { router as loginApi }