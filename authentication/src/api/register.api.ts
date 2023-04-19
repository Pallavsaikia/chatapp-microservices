import express from "express";
import { handle } from "../middleware/error-handlers";
import { registerUserController } from "../controllers";
import { registerValidationSchema } from "../util/validation-schemas";
import {  validateRequestSchema } from "../middleware/validations";

const router = express.Router()


router.post('/',
    registerValidationSchema,
    validateRequestSchema,
    handle(registerUserController))

export { router as registerApi }