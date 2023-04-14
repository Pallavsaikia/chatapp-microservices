import mongoose from "mongoose";
import { Password } from "../util/password";


interface UserAttr {
    email: String,
    username: String,
    password: String,
    verified: Boolean
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attr: UserAttr): UserDoc

}

interface UserDoc extends mongoose.Document {
    _id: String,
    email: String,
    username: String,
    password: String,
    verified: Boolean,
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
        },
        verified: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true
    }
)


userSchema.statics.build = (attr: UserAttr) => {
    return new User(attr)
}

userSchema.statics.passwordhash = (attr: UserAttr) => {
    return new User(attr)
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


