import { DateTime } from "../util/datetime";
import { UnAuthorizedError } from "../middleware/error-handlers";
import { StatusCode } from "../util/response";
import { OtpMetaData } from "../config";
import { Otp, User } from "../models";
import { UserAttrTrimmed, UserDocTrimmed } from "../models/types";

interface ValidateUserOtpSerciveResponseWrapper {
    valid: Boolean,
    error: UnAuthorizedError | null
}

export async function validateUserOtpSercive(userid: string, otp: string): Promise<ValidateUserOtpSerciveResponseWrapper> {
    const timenow = DateTime.getDateTimeInMilli()
    const unauthorizedError = new UnAuthorizedError([])
    unauthorizedError.reason = "something wrong with otp sent"

    const [user, otpData] = await Promise.all([
        User.findById({ _id: userid }).exec(),
        Otp.find({ userid: userid, otp: otp, validUpto: { $gt: timenow } }).lean()
    ])
    if (!user) {
        unauthorizedError.push({ msg: "invalid user id", param: "userid" })
        return {
            valid: false,
            error: unauthorizedError
        }
    }

    if (user.otpAttempts >= OtpMetaData.MaxOTPAttempts) {
        unauthorizedError.push({ msg: "max otp attemps done", param: "otp" })
        unauthorizedError.status = StatusCode._403
        user.otpAttempts = 0
        user.otpTimeOut = DateTime.getDateTimeAheadInMilli(OtpMetaData.OTPTimeoutInMilli)
        await user.save()
        return {
            valid: false,
            error: unauthorizedError
        }
    }
    if (user.otpTimeOut > timenow) {
        unauthorizedError.status = StatusCode._403
        unauthorizedError.push({
            msg: "user timed out for " +
                DateTime.getSecondsRemaining(user.otpTimeOut, timenow) + " seconds",
            param: "otp"
        })
        return {
            valid: false,
            error: unauthorizedError
        }
    }

    if (otpData.length <= 0) {
        unauthorizedError.push({ msg: "invalid otp", param: "otp" })
        user.otpAttempts = user.otpAttempts + 1
        await user.save()
        return {
            valid: false,
            error: unauthorizedError
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

export async function userRegistrationService(user: UserAttrTrimmed, otp: string): Promise<UserDocTrimmed> {
    const saveduser = await User.buildTrimmed({ email: user.email, username: user.username, password: user.password }).save()
    await Otp.build({
        userid: saveduser._id, otp: otp,
        validUpto: DateTime.getDateTimeAheadInMilli(OtpMetaData.OTPValidityInMilli)
    }).save()
    return saveduser
}