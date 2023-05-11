import { StatusCode } from  "@pschatapp/response";

export interface UnAuthorizedErrorAttr {
    msg: string,
    param: string
}
export class UnAuthorizedError extends Error {

    status: StatusCode.unauthorized | StatusCode.forbidden = StatusCode._401
    reason = "Action Unauthorized"

    constructor(public errors: UnAuthorizedErrorAttr[]) {
        super()
        Object.setPrototypeOf(this, UnAuthorizedError.prototype)
    }
    push(error: UnAuthorizedErrorAttr) {
        this.errors.push(error)
    }
}