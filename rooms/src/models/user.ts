import mongoose from "mongoose";
import { UserAttr, UserDoc, UserModel } from "./types";





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



    },
    {
        timestamps: true
    }
)

userSchema.statics.build = (attr: UserAttr) => {
    return new User(attr)
}



const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }



