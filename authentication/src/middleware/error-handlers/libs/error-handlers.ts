import { Response, Request, NextFunction } from "express";
import { ErrorResponse, StatusCode } from "../../../util/response";
import { DBConnectionError, PageNotFoundError, RequestValidationError } from "../../../util/errors";
import { DBConflictError } from "../../../util/errors/lib/db-conflict-error";

export const ErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof RequestValidationError) {
        const formattedErrors = err.errors.map(error => {
            return { message: error.msg, field: error.param }
        })
        return new ErrorResponse(res, {
            error: formattedErrors,
            message: err.reason,
            statuscode: err.status,
            __t: null
        })
    }

    if (err instanceof DBConnectionError) {
        return new ErrorResponse(res, {
            error: [{ message: err.reason }],
            message: err.reason,
            statuscode: err.status,
            __t: null
        })
    }

    if (err instanceof PageNotFoundError) {
        return new ErrorResponse(res, {
            error: [{ message: err.reason }],
            message: err.reason,
            statuscode: err.status,
            __t: null
        })
    }

    if (err instanceof DBConflictError) {
        const formattedErrors = err.errors.map(error => {
            return { message: error.msg, field: error.param }
        })
        return new ErrorResponse(res, {
            error: formattedErrors,
            message: err.reason,
            statuscode: err.status,
            __t: null
        })
    }
    new ErrorResponse(res, {
        error: [{ message: "something went wrong" }],
        // message: "something went wrong",
        message: err.message,
        statuscode: StatusCode._404,
        __t: null
    })
}