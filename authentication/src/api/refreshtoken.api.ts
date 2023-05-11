import express from "express";
import { refreshTokenController } from "../controllers";
import { handle } from "../middleware/error-handlers";
import { refreshTokenValidationSchema } from "../util/validation-schemas/libs/refreshtoken.validation.schema";
import { validateRequestSchema } from "../middleware/validations";


const router = express.Router()

router.post('/', refreshTokenValidationSchema,
    validateRequestSchema
    , handle(refreshTokenController))

export { router as refreshTokenApi }