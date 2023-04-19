import express from "express";
import {  validateRequestSchema } from "../middleware/validations";
import { handle } from "../middleware/error-handlers";
import { verifyUserController } from "../controllers";
import { verifyUserValidationSchema } from "../util/validation-schemas";

const router = express.Router()


router.post('/',
    verifyUserValidationSchema,
    validateRequestSchema,
    handle(verifyUserController)
)

export { router as verifyUserApi}