import mongoose from "mongoose";

export interface UserAttr {
    _id: String,
    email: String,
    username: String,
}


export interface UserModel extends mongoose.Model<UserDoc> {
    build(attr: UserAttr): UserDoc
}

export interface UserDoc extends mongoose.Document {
    _id: String,
    email: String,
    username: String,
    createdAt: String,
    updatedAt: String
}







