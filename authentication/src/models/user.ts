import mongoose from "mongoose";


interface UserAttr {
    email: String,
    username: String,
    password: String
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attr: UserAttr): UserDoc

}

interface UserDoc extends mongoose.Document {
    _id: String,
    email: String,
    username: String,
    password: String,
    createdAt: String,
    updatedAt: String
}
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            index: true
        },
        username: {
            type: String,
            required: true,
            index: true
        },
        password: {
            type: String,
            required: true,
        }
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


