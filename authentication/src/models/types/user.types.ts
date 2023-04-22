import mongoose from "mongoose";

export interface UserAttr {
    email: String,
    username: String,
    password: String,
    verified: Boolean
    blockOTPRequest: Boolean,
    otpTimeOut: number,
    otpAttempts: number
}

export interface UserAttrTrimmed {
    email: String,
    username: String,
    password: String
}
export interface UserModel extends mongoose.Model<UserDoc> {
    build(attr: UserAttr): UserDoc
    buildTrimmed(attr: UserAttrTrimmed): UserDoc
}

export interface UserDoc extends mongoose.Document {
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

export interface UserDocTrimmed
    extends Omit<UserDoc,
        "password" |
        "verified" |
        "blockOTPRequest" |
        "otpTimeOut" |
        "otpAttempts"
    > {
    _id: String,
    email: String,
    username: String
    createdAt: String,
    updatedAt: String
}

export enum UserDocSecuredEnum {
    _id = "_id",
    email = "email",
    username = "username",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
}



