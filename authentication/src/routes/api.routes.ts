import express from "express";

import { JWTAuth } from "@pschatapp/middleware";
import {
    registerApi,
    testApi,
    verifyUserApi,
    loginApi,
    refreshTokenApi
} from "../api";
import { Config } from "../config";

const app = express.Router()
const jwtauth = new JWTAuth(Config.JWT_ACCESS_TOKEN_SALT)

app.use("/register", registerApi)
app.use("/verify-user", verifyUserApi)
app.use("/login", loginApi)

app.use("/refreshtoken", refreshTokenApi)
app.use("/test", jwtauth.authFnMiddleware(), testApi)

export { app }