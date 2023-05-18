import mongoose from "mongoose";

export interface RoomAttr {
    name: String,
    description: String,
    createdBy: mongoose.Schema.Types.ObjectId 
}


export interface RoomModel extends mongoose.Model<RoomDoc> {
    build(attr: RoomAttr): RoomDoc
}

export interface RoomDoc extends mongoose.Document {
    _id: String,
    name: String,
    description: String,
    createdBy: mongoose.Schema.Types.ObjectId,
    createdAt: String,
    updatedAt: String
}







