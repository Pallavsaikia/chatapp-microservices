import mongoose from "mongoose";
import { Password } from "../util/password";


interface OTPAttr {
    userid: String,
    otp: String,
    validUpto: Number,
}

interface OTPModel extends mongoose.Model<OTPDoc> {
    build(attr: OTPAttr): OTPDoc
}

interface OTPDoc extends mongoose.Document {
    _id: String
    userid: String,
    otp: String,
    validUpto: Number,
    createdAt: String,
    updatedAt: String
}

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

// OTPSchema.pre('save', async function (done) {
//     if (this.isModified('otp')) {
//         const hashed = await Password.toHash(this.get('otp'))
//         this.set('otp', hashed)
//     }
//     done()
// })

const Otp = mongoose.model<OTPDoc, OTPModel>('OTP', OTPSchema)

export { Otp }


