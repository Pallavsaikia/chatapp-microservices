import express from "express";
import { JWTRefresh } from "../middleware/jwt-authentication";
import { Config } from "../config";


const router = express.Router()

const jwtRefresh = new JWTRefresh(Config.JWT_REFRESH_TOKEN_SALT, Config.JWT_ACCESS_TOKEN_SALT)

router.post('/',jwtRefresh.refreshMiddleware())

export { router as refreshTokenApi }