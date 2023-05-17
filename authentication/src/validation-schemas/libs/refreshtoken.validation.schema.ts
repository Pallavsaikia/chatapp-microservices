import { body } from "express-validator";

export const refreshTokenValidationSchema = [
    body('refreshtoken')
        .exists()
        .withMessage('refreshtoken is required')
        .trim()
        .escape(),
]