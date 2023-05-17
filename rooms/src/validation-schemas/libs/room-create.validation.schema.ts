import { body } from "express-validator";

export const verifyRoomCreateSchema = [
    body('roomname')
        .isLength({ min: 4, max: 10 })
        .withMessage('roomname shouldbe 4-10 char long'),
    body('description').trim().escape(),
]
