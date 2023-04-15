import { JWTUserbody } from "./jwt-user-defination-body"

export interface JWTTokenAttr {
    user: JWTUserbody,
    salt: string
    jwtExpiry: number | null
}