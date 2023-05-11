import { ValidationError } from "express-validator"
import { StatusCode } from  "@pschatapp/response";

export interface DBConflictErrorAttr {
    msg: string,
    param: string
}
export class DBConflictError extends Error {

    status = StatusCode._409
    reason = "Resource already exist"

    constructor(public errors: DBConflictErrorAttr[]) {
        super()
        Object.setPrototypeOf(this, DBConflictError.prototype)
    }
    push(error: DBConflictErrorAttr) {
        this.errors.push(error)
    }
}