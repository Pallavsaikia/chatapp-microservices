import { Response, Request, NextFunction } from "express";
import { ErrorResponse, StatusCode } from "../util/response";

export const ErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    new ErrorResponse(res, {
        error: err,
        message: "something went wrong",
        statuscode: StatusCode._404,
        __t: null
    })
}