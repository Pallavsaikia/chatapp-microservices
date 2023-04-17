import mongoose from "mongoose";
import { Password } from "../util/password";

export enum OtpMetaData {
    MaxOTPATTempts = 5,
    OTPValidityInMilli = 900000 //15 minutes
}
interface UserAttr {
    email: String,
    username: String,
    password: String,
    verified: Boolean
    blockOTPRequest: Boolean,
    otpTimeOut: number,
    otpAttempts: number
}
interface UserAttrTrimmed {
    email: String,
    username: String,
    password: String
}
interface UserModel extends mongoose.Model<UserDoc> {
    build(attr: UserAttr): UserDoc
    buildTrimmed(attr: UserAttrTrimmed): UserDoc
    canRequestOtp(_id: String): Boolean
}

interface UserDoc extends mongoose.Document {
    _id: String,
    email: String,
    username: String,
    password: String,
    verified: Boolean,
    blockOTPRequest: Boolean,
    otpTimeOut: number,
    otpAttempts: number
    createdAt: String,
    updatedAt: String
}
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            index: true,
            unique: true
        },
        username: {
            type: String,
            required: true,
            index: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        blockOTPRequest: {
            type: Boolean,
            default: false,
        },
        otpTimeOut: {
            type: Number,
            default: 0
        },
        otpAttempts: {
            type: Number,
            default: 0
        },

    },
    {
        timestamps: true
    }
)


userSchema.statics.build = (attr: UserAttr) => {
    return new User(attr)
}
userSchema.statics.buildTrimmed = (attr: UserAttrTrimmed) => {
    return User.build({
        ...attr,
        verified: false,
        blockOTPRequest: false,
        otpTimeOut: 0,
        otpAttempts: 0
    })
}

userSchema.statics.canRequestOtp = async (_id: String): Promise<Boolean> => {
    const user = await User.findById({ _id: _id }).lean()
    if (!user) {
        return false
    }
    if (user.otpTimeOut) {
        return false
    }
    if (user.blockOTPRequest) {
        return false
    }
    if (user.otpAttempts >= OtpMetaData.MaxOTPATTempts) {
        return false
    }
    return true
}



userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'))
        this.set('password', hashed)
    }
    done()
})
const User = mongoose.model<UserDoc, UserModel>('User', userSchema)


export { User }



