import { StatusCode } from  "@pschatapp/response";

export class DBConnectionError extends Error {
    reason = "Couldnot connect to Db"
    status = StatusCode._500
    constructor() {
        super()
        Object.setPrototypeOf(this, DBConnectionError.prototype)
    }
}