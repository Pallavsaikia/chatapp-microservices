import { StatusCode } from "../../../../../util/response"


export interface JWtTokenExpiryAttr {
    msg: string,
    param: string
}
export class JWtTokenExpiryError extends Error {

    status = StatusCode._401
    reason = "Token Expired"

    constructor(public errors: JWtTokenExpiryAttr[]) {
        super()
        Object.setPrototypeOf(this, JWtTokenExpiryError.prototype)
    }
    push(error: JWtTokenExpiryAttr) {
        this.errors.push(error)
    }
}