import express from "express";
import { verifyUserValidationSchema, validateRequestSchema } from "../../middleware/validations";
import { handle } from "../../middleware/error-handlers";
import { verifyUserController } from "../controllers/verification/";

const router = express.Router()


router.post('/',
    verifyUserValidationSchema,
    validateRequestSchema,
    handle(verifyUserController)
)

export { router as verifyUserRouter}