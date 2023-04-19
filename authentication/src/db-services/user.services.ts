import { UserDocTrimmed } from "../models/types"
import { User } from "../models"
import { DBConflictError, UnAuthorizedError } from "../middleware/error-handlers"
import { Password } from "../util/password"

export interface IsUserNameOrEmailAvailableAttr {
    username: String,
    email: String
}
export interface IsUserNameOrEmailAvailableReturnAttr {
    error: Boolean,
    user: UserDocTrimmed | null
    errorDescription: DBConflictError | null

}
export interface AuthenticateUserAttr {
    username: String,
    password: String

}
export interface AuthenticateUserReturnAttr {
    error: Boolean,
    user: UserDocTrimmed | null
    errorDescription: UnAuthorizedError | null

}
export async function authenticateUserService({ username, password }: AuthenticateUserAttr): Promise<AuthenticateUserReturnAttr> {
    const user = await User.findOne({ username: username }).lean()
    const unauthorizedError = new UnAuthorizedError([])
    if (!user) {
        unauthorizedError.push({ msg: "username doesnot exist", param: "username" })
        return {
            error: true,
            user: null,
            errorDescription: unauthorizedError
        }
    }
    if (!user.verified) {
        unauthorizedError.push({ msg: "email not verified", param: "email" })
        return {
            error: true,
            user: null,
            errorDescription: unauthorizedError
        }
    }
    
    if (!(await Password.compare(user.password.toString(), password.toString()))) {
        unauthorizedError.push({ msg: "wrong credential", param: "password" })
        
        return {
            error: true,
            user: null,
            errorDescription: unauthorizedError
        }
    }

    return {
        error: false,
        user: user,
        errorDescription: null
    }
}

export async function isUserNameOrEmailAvailableService({ username, email }: IsUserNameOrEmailAvailableAttr): Promise<IsUserNameOrEmailAvailableReturnAttr> {
    const userList = await User.find({ $or: [{ username: username }, { email: email }] }).lean()
    const dbConflictError = new DBConflictError([])

    if (userList.length <= 0) {
        return {
            error: false,
            user: null,
            errorDescription: null
        }
    } else {
        const user = userList[0]
        if (user!.username === username) {
            dbConflictError.push({ msg: "username already exists", param: "username" })
        }
        if (user!.email === email) {
            dbConflictError.push({ msg: "email already exists", param: "email" })
        }
        return {
            error: true,
            user: user,
            errorDescription: dbConflictError
        }
    }
}


