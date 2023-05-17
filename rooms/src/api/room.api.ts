import express from "express";
import { handle,validateRequestSchema } from "@pschatapp/middleware";
import { verifyRoomCreateSchema } from "../validation-schemas";
import { roomController } from "../controllers";


const router = express.Router()


router.post('/',
    verifyRoomCreateSchema,
    validateRequestSchema,
    handle(roomController))

export { router as roomApi }