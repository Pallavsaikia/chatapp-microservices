import { ValidationError } from "express-validator"
import { StatusCode } from "../../../../util/response"

export class RequestValidationError extends Error {
    status=StatusCode._400
    reason="validation error"
    constructor(public errors: ValidationError[]) {
        super()
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }
}