import express from "express";

import { JWTAuth } from "../middleware/jwt-authentication";
import {
    registerApi,
    testApi,
    verifyUserApi,
    loginApi
} from "../api";
import { Config } from "../config";

const app = express.Router()
const jwtauth = new JWTAuth(Config.JWT_ACCESS_TOKEN_SALT)

app.use("/register", registerApi)
app.use("/verify-user", verifyUserApi)
app.use("/login", loginApi)
app.use("/test", jwtauth.authFnMiddleware(), testApi)

export { app }