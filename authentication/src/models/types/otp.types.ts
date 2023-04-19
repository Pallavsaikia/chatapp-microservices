import mongoose from "mongoose"

export interface OTPAttr {
    userid: String,
    otp: String,
    validUpto: Number,
}

export interface OTPModel extends mongoose.Model<OTPDoc> {
    build(attr: OTPAttr): OTPDoc
}

export interface OTPDoc extends mongoose.Document {
    _id: String
    userid: String,
    otp: String,
    validUpto: Number,
    createdAt: String,
    updatedAt: String
}
