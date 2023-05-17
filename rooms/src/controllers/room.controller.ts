import { Request, Response, NextFunction } from "express";

import { Config } from "../config";
import { getJwtTokensWrapper } from "../util/wrappers";
import { SuccessResponse, StatusCode } from "@pschatapp/response";

export async function roomController(req: Request, res: Response, next: NextFunction) {


}