import { body } from "express-validator";

export const verifyUserValidationSchema = [
    body('otp')
        .isLength({ min: 6, max: 6 })
        .withMessage('otp shouldbe 6 char long')
        .exists()
        .withMessage('otp is required')
        .trim()
        .matches(/^[0-9]+$/)
        .withMessage('username must be numeric only')
        .escape(),
    body('userid').exists().withMessage('userid is required').trim().escape(),
]
