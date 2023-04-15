import jwt from "jsonwebtoken"
import { JWTTokenAttr } from "./schema/definations/jwt-body-attr"
import { JWTTokenType } from "./schema/definations/jwt-token-type"
import { JWTTokenExpiryTime } from "./schema/definations/jwt-expiry"



export class JWT {

    private static jwtExpirytime(time: number) {//expiry in 15 minutes
        return new Date().getTime() + time
    }

    static getNewAccessToken(tokenBody: JWTTokenAttr) {
        /**
         * Default expiry value of 15 minutes or 900000 ms
         */
        const { user, salt, jwtExpiry } = tokenBody
        return jwt.sign({
            id: user._id, username: user.username, tokentype: JWTTokenType.access,
            exp: (jwtExpiry === null) ? this.jwtExpirytime(JWTTokenExpiryTime.access) : this.jwtExpirytime(jwtExpiry)
        }, salt)
    }

    static getNewRefreshToken(tokenBody: JWTTokenAttr) {
        /**
         * Default expiry value of 15 minutes or 7889400000 ms
         */
        const { user, salt, jwtExpiry } = tokenBody
        return jwt.sign({
            id: user._id, username: user.username, tokentype: JWTTokenType.refresh,
            exp: (jwtExpiry === null) ? this.jwtExpirytime(JWTTokenExpiryTime.refresh) : this.jwtExpirytime(jwtExpiry)
        }, salt)
    }

}

