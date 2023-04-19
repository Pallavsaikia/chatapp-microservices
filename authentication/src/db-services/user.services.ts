import { UserDocTrimmed } from "../models/types"
import { User } from "../models"
import { DBConflictError } from "../middleware/error-handlers"

export interface IsUserNameOrEmailAvailableAttr {
    username: String,
    email: String
}
export interface IsUserNameOrEmailAvailableReturnAttr {
    error: Boolean,
    user: UserDocTrimmed | null
    errorDescription: DBConflictError | null
}
export async function isUserNameOrEmailEService({ username, email }: IsUserNameOrEmailAvailableAttr): Promise<IsUserNameOrEmailAvailableReturnAttr> {
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


