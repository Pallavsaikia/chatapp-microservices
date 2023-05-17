import express from "express";

import { JWTAuth } from "@pschatapp/middleware";
import {
    roomApi,
} from "../api";
import { Config } from "../config";

const app = express.Router()
const jwtauth = new JWTAuth(Config.JWT_ACCESS_TOKEN_SALT)

app.use("/rooms", jwtauth.authFnMiddleware(), roomApi)

export { app }