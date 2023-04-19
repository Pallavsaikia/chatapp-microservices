import express from "express";
import { registerValidationSchema, validateRequestSchema } from "../../middleware/validations";
import { handle } from "../../middleware/error-handlers";
import { registerUserController } from "../controllers/registration/";


const router = express.Router()


router.post('/',
    registerValidationSchema,
    validateRequestSchema,
    handle(registerUserController))

export { router as registerRouter }