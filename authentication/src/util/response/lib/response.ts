import { Response } from "express"
import { StatusCode } from "./codes/status_code";

export interface ResponseAttr {
    success: Boolean,
    data: Object | null,
    message: String,
    error: Object | null,
    __t: number
}


export class ResponseBody {

    statusCode: StatusCode;
    responseAttr: ResponseAttr;

    constructor(statusCode: StatusCode, responseAttr: ResponseAttr) {
        this.statusCode = statusCode
        this.responseAttr = responseAttr
    }

    send(response: Response): void {
        response.status(this.statusCode);
        response.json({
            success: this.responseAttr.success,
            data: this.responseAttr.data,
            message: this.responseAttr.message,
            error: this.responseAttr.error,
            __t: this.responseAttr.__t
        });
    }




}
