import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose';

const mongoDbStart = async () => {
    try {
        await mongoose.connect("mongodb://authentication-mongo-srv:27017/auth")
        console.log('connected to db')
    } catch (e) {
        console.log(e)
    }

}
export function app() {
    const app = express();
    app.use(morgan('dev'))

    app.get('/', (req, res) => {
        res.send('hello world')
    })
    mongoDbStart()
    return app
}
