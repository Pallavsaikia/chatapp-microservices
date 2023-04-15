import express from "express";
import { router as registerApi } from '../api_endpoints/register.api'
import { router as testApi } from '../api_endpoints/test.api'
import { JWTAuth } from "../../middleware/jwt-authentication";

const app = express.Router()
const jwtauth = new JWTAuth(process.env.JWT_ACCESS_TOKEN_SALT!)

app.use("/register", registerApi)
app.use("/test", jwtauth.authFnMiddleware(), testApi)

export { app }