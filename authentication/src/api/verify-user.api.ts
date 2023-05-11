import express from "express";
import { verifyUserController } from "../controllers";
import { handle,validateRequestSchema } from "@pschatapp/middleware";
import { verifyUserValidationSchema } from "../util/validation-schemas";

const router = express.Router()


router.post('/',
    verifyUserValidationSchema,
    validateRequestSchema,
    handle(verifyUserController)
)

export { router as verifyUserApi}