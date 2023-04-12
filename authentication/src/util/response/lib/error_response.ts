import { ResponseBody } from "./response";
import { StatusCode } from "./codes/status_code";
import { Response } from "express"
import { TokenCode } from "./codes/token_code";

export interface ErrorAttr {
    message: String,
    statuscode: StatusCode | null
    __t: TokenCode | null,
    error: Array<any> | null
}


export class ErrorResponse extends ResponseBody {
    constructor(response: Response, errorAttr: ErrorAttr) {
        super(errorAttr.statuscode ? errorAttr.statuscode : StatusCode._500, {
            success: false,
            data: null,
            message: errorAttr.message,
            error: errorAttr.error,
            __t: errorAttr.__t ? errorAttr.__t : TokenCode.okay
        })

        this.send(response)
    }
}
