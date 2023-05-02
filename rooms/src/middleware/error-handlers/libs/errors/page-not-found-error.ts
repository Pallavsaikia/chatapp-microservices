import { StatusCode } from "../../../../util/response"

export class PageNotFoundError extends Error {
    reason = "Page not found"
    status = StatusCode._404
    constructor() {
        super()
        Object.setPrototypeOf(this, PageNotFoundError.prototype)
    }
}