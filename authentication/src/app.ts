import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose';
import { DBConnectionError, PageNotFoundError } from './util/errors';
import { ErrorHandler } from './middleware/error-handlers';
import { User } from './models';




const mongoDbStart = async () => {
    try {
        const db=await mongoose.connect("mongodb://admin:password123@127.0.0.1:30201/auth?authSource=admin")
        
    } catch (e) {
        console.log(e)
        // throw new DBConnectionError()
        const user=new User()
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
