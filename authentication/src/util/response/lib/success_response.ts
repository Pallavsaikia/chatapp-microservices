import { ResponseBody } from "./response";
import { StatusCode } from "./codes/status_code";
import { Response } from "express"
import { TokenCode } from "./codes/token_code";

export interface SuccessResponseAttr {
    data: Object | null,
    message: String,
    statuscode: StatusCode | null
}


export class SuccessResponse extends ResponseBody {
    constructor(response: Response, succesAttr: SuccessResponseAttr) {
        super(succesAttr.statuscode ? succesAttr.statuscode : StatusCode._200, {
            success: true,
            data: succesAttr.data,
            message: succesAttr.message,
            error: null,
            __t: TokenCode.okay
        })

        this.send(response)
    }
}
