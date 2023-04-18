import { Response } from "supertest";



export function isValidErrorResonseBody(res: Response) {
    expect(res.body).toEqual(
        expect.objectContaining({
            success: expect.any(Boolean),
            message: expect.any(String),
            data: null,
            error: expect.any(Array),
            __t: expect.any(Number)
        }))

    expect(res.body.success).toBe(false)
};
export function isValidError(res: Response) {
    for (let i = 0; i < res.body.error.length; i++) {
        expect(res.body.error[i]).toEqual(
            expect.objectContaining({
                message: expect.any(String),
                field: expect.any(String),
            }))
    }

}


export function isValidSuccessResonseBody(res: Response) {
    expect(res.body).toEqual(
        expect.objectContaining({
            success: expect.any(Boolean),
            message: expect.any(String),
            data: expect.any(Object),
            error: null,
            __t: expect.any(Number)
        }))

    expect(res.body.success).toBe(true)
};