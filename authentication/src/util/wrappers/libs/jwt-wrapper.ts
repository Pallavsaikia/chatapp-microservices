import { JWT } from "@pschatapp/middleware";
export interface UserTypesJWt {
    _id: String,
    email: String,
    username: String
}

export function getJwtTokensWrapper(user: UserTypesJWt, accessKeySalt: string, refreshKeySalt?: string) {
    const accessKey = JWT.getNewAccessToken({
        _id: user._id,
        username: user.username, salt: accessKeySalt, jwtExpiry: null
    })
    let refreshKey
    if (refreshKeySalt) {
        refreshKey = JWT.getNewRefreshToken({
            _id: user._id,
            username: user.username, salt: refreshKeySalt, jwtExpiry: null
        })
    }

    return {
        accessToken: accessKey,
        refreshToken: refreshKey
    }
}