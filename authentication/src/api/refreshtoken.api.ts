import express from "express";
import { refreshTokenController } from "../controllers";
import { refreshTokenValidationSchema } from "../util/validation-schemas/libs/refreshtoken.validation.schema";
import { handle,validateRequestSchema } from "@pschatapp/middleware";



const router = express.Router()

router.post('/', refreshTokenValidationSchema,
    validateRequestSchema
    , handle(refreshTokenController))

export { router as refreshTokenApi }