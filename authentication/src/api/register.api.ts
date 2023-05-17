import express from "express";
import { registerUserController } from "../controllers";
import { handle,validateRequestSchema } from "@pschatapp/middleware";
import { registerValidationSchema } from "../validation-schemas";


const router = express.Router()


router.post('/',
    registerValidationSchema,
    validateRequestSchema,
    handle(registerUserController))

export { router as registerApi }