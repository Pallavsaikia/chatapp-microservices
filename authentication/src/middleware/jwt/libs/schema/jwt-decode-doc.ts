import { JWTTokenType } from "./jwt-token-type"

export interface JWTTokenDoc {
    id: string,
    username: string,
    tokentype: JWTTokenType
    exp: number
}