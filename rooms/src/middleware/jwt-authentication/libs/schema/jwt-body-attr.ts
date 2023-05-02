

export interface JWTTokenAttr {
    _id: String,
    username: String,
    salt: string
    jwtExpiry: number | null
}