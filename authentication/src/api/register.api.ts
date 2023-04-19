import express from "express";
import { registerUserController } from "../controllers";
import { handle } from "../middleware/error-handlers";
import {  validateRequestSchema } from "../middleware/validations";
import { registerValidationSchema } from "../util/validation-schemas";


const router = express.Router()


router.post('/',
    registerValidationSchema,
    validateRequestSchema,
    handle(registerUserController))

export { router as registerApi }