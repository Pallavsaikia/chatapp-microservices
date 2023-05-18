import mongoose from "mongoose";
import { RoomAttr, RoomDoc, RoomModel } from "./types";






const roomSchema = new mongoose.Schema(
    {

        name: {
            type: String,
            required: true,
            index: true,
            unique: true
        },
        description: {
            type: String,
            required: false,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
)

roomSchema.statics.build = (attr: RoomAttr) => {
    return new Room(attr)
}



const Room = mongoose.model<RoomDoc, RoomModel>('User', roomSchema)

export { Room }



