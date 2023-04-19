import mongoose from "mongoose";
import { OTPAttr, OTPDoc, OTPModel } from "./types";


const OTPSchema = new mongoose.Schema(
    {
        userid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        otp: {
            type: String,
            required: true,
        },
        validUpto: {
            type: Number,
            required: true,
        },

    },
    {
        timestamps: true
    }
)


OTPSchema.statics.build = (attr: OTPAttr) => {
    return new Otp(attr)
}



const Otp = mongoose.model<OTPDoc, OTPModel>('OTP', OTPSchema)

export { Otp }


