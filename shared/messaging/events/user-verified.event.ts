import { Event } from "../base";

export interface UserVerifiedAttr {
    _id: String,
    email: String,
    username: String
    createdAt: String,
    updatedAt: String,
}

export interface UserVerifiedEvent extends Event {
    data: UserVerifiedAttr
}