import mongoose from "mongoose";
import { Password } from "../util/password";
import { UserAttr, UserAttrTrimmed, UserDoc, UserModel } from "./types";



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



userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'))
        this.set('password', hashed)
    }
    done()
})
const User = mongoose.model<UserDoc, UserModel>('User', userSchema)


export { User }



