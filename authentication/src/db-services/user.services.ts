import { UserDocTrimmed } from "../models/types"
import { User } from "../models"

export interface IsUserNameOrEmailAvailableAttr {
    username: String,
    email: String
}
export interface IsUserNameOrEmailAvailableReturnAttr {
    available: Boolean,
    user: UserDocTrimmed | null
}
export async function IsUserNameOrEmailAvailableService({ username, email }: IsUserNameOrEmailAvailableAttr): Promise<IsUserNameOrEmailAvailableReturnAttr> {
    const user = await User.find({ $or: [{ username: username }, { email: email }] }).lean()
    if (user.length <= 0) {
        return {
            available: true,
            user: null
        }
    } else {
        return {
            available: false,
            user: user[0]
        }
    }
}


