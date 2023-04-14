import express from "express";
import { router as registerApi } from '../api_endpoints/register.api'

const app = express.Router()

app.use("/register", registerApi)


export { app }