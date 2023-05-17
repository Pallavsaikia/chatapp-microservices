import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from 'mongoose';

export const mockMongoConnect = async () => {
    try {
        const mongoServer = await MongoMemoryServer.create()
        await mongoose.connect(mongoServer.getUri())
        console.log("connected to db")
    } catch (e) {
        console.log(e)
        // throw new DBConnectionError()
    }

}

export const mockMongoDisconnect = async () => {
    try {
        await mongoose.disconnect()
        await mongoose.connection.close()
    } catch (e) {
        console.log(e)
        // throw new DBConnectionError()
    }

}