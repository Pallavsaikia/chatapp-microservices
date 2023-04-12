import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose';
import { DBConnectionError, PageNotFoundError } from './util/errors';
import { ErrorHandler } from './middleware/error-handlers';

const mongoDbStart = async () => {
    try {
        await mongoose.connect("mongodb://authentication-mongo-srv:27017/auth")
        console.log('connected to db')
    } catch (e) {
        throw new DBConnectionError()
    }

}
export function app() {
    const app = express();

    app.use(morgan('dev'))
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    mongoDbStart()

    app.get('/', (req, res) => {
        res.send('hello world')
    })


    //error for page not found
    app.use((req, res, next) => {
        const error = new PageNotFoundError()
        next(error);
    });

    //global error response--just throw error
    app.use(ErrorHandler);


    return app
}
