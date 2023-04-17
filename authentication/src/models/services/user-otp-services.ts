import { DateTime } from "../../util/datetime";
import { DBConflictError } from "../../util/errors";
import { OtpMetaData } from "../meta/otp-meta";
import { Otp } from "../otp";
import { User } from "../user";

interface ValidateUserOtpSerciveResponseWrapper {
    valid: Boolean,
    error: DBConflictError | null
}

export async function ValidateUserOtpSercive(userid: string, otp: string): Promise<ValidateUserOtpSerciveResponseWrapper> {
    const timenow = DateTime.getDateTimeInMilli()
    const dbConflictError = new DBConflictError([])
    dbConflictError.reason = "something wrong with otp sent"

    const [user, otpData] = await Promise.all([
        User.findById({ _id: userid }).exec(),
        Otp.find({ userid: userid, otp: otp, validUpto: { $gt: timenow } }).lean()
    ])
    if (!user) {
        dbConflictError.push({ msg: "invalid user id", param: "userid" })
        return {
            valid: false,
            error: dbConflictError
        }
    }

    if (user.otpAttempts >= OtpMetaData.MaxOTPAttempts) {
        dbConflictError.push({ msg: "max otp attemps done", param: "otp" })
        user.otpAttempts = 0
        user.otpTimeOut = DateTime.getDateTimeAheadInMilli(OtpMetaData.OTPTimeoutInMilli)
        await user.save()
        return {
            valid: false,
            error: dbConflictError
        }
    }
    if (user.otpTimeOut > timenow) {

        dbConflictError.push({
            msg: "user timed out for " +
                DateTime.getSecondsRemaining(user.otpTimeOut, timenow) + " seconds",
            param: "otp"
        })
        return {
            valid: false,
            error: dbConflictError
        }
    }

    if (otpData.length <= 0) {
        dbConflictError.push({ msg: "invalid otp", param: "otp" })
        user.otpAttempts = user.otpAttempts + 1
        await user.save()
        return {
            valid: false,
            error: dbConflictError
        }
    }
    if (otpData.length > 0) {
        user.verified = true
        user.otpAttempts = 0
        user.otpTimeOut = 0
        user.blockOTPRequest = false
        await user.save()
    }
    return {
        valid: true,
        error: null
    }
}