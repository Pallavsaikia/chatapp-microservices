import { StatusCode } from "../../../../../util/response"


export interface InvalidJWtTokenAttr {
    msg: string,
    param: string
}
export class InvalidJWtTokenError extends Error {

    status = StatusCode._401
    reason = "Invalid Token"

    constructor(public errors: InvalidJWtTokenAttr[]) {
        super()
        Object.setPrototypeOf(this, InvalidJWtTokenError.prototype)
    }
    push(error: InvalidJWtTokenAttr) {
        this.errors.push(error)
    }
}