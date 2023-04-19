import { JWT } from "../../../middleware/jwt-authentication"

export interface UserTypesJWt {
    _id: String,
    email: String,
    username: String
}

export function getJwtTokensWrapper(user: UserTypesJWt, accessKeySalt: string, refreshKeySalt: string) {
    const accessKey = JWT.getNewAccessToken({
        _id: user._id,
        username: user.username, salt: accessKeySalt, jwtExpiry: null
    })

    const refreshKey = JWT.getNewRefreshToken({
        _id: user._id,
        username: user.username, salt: refreshKeySalt, jwtExpiry: null
    })
    return {
        accessToken: accessKey,
        refreshToken: refreshKey
    }
}