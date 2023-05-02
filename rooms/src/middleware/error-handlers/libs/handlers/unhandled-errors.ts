import { NextFunction, Request, Response } from "express"


export const handle = (fn: Function) => async (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch((e) => {
        console.log(e)
        next(e)
    })
}