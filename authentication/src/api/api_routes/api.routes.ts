import express from "express";

import { JWTAuth } from "../../middleware/jwt-authentication";
import {
    registerRouter,
    testRouter,
    verifyUserRouter
} from "../api_endpoints";

const app = express.Router()
const jwtauth = new JWTAuth(process.env.JWT_ACCESS_TOKEN_SALT!)

app.use("/register", registerRouter)
app.use("/verify-user", verifyUserRouter)
app.use("/test", jwtauth.authFnMiddleware(), testRouter)

export { app }