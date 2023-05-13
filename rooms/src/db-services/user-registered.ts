import { error } from "console"
import { User } from "../models"
import { UserAttr } from "../models/types"
import { DBConflictError, UnAuthorizedError } from '@pschatapp/middleware'

export async function findUserByID(_id: String): Promise<UserAttr | null> {
    return User.findById(_id).lean()
}
interface userRegistrationServiceResponseAttr {
    success: boolean,
    userAttr?: UserAttr,
    error?: DBConflictError
}

export async function userRegistrationService(user: UserAttr): Promise<userRegistrationServiceResponseAttr> {
    const dbConflictError = new DBConflictError([])
    if (await findUserByID(user._id)) {
        dbConflictError.push({ msg: "User id not Unique", param: "_id" })
        return {
            success: false,
            error: dbConflictError
        }
    }
    const userAttrs = await User.build(user).save()
    return {
        success: true,
        userAttr: userAttrs
    }

}