import express from "express";
import { verifyUserController } from "../controllers";
import { handle } from "../middleware/error-handlers";
import {  validateRequestSchema } from "../middleware/validations";
import { verifyUserValidationSchema } from "../util/validation-schemas";

const router = express.Router()


router.post('/',
    verifyUserValidationSchema,
    validateRequestSchema,
    handle(verifyUserController)
)

export { router as verifyUserApi}