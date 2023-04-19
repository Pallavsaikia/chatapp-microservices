import { NextFunction, Request, Response } from "express"


export const handle = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((e: Error) => { new Error((e as Error).message) })
}