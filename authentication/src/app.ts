import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(__dirname, '../.env') })

import express, { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose';
import { app as apiRoutes } from './api/api_routes/api.routes'
import { DBConnectionError, PageNotFoundError } from './middleware/error-handlers/libs/errors';
import { ErrorHandler, handle } from './middleware/error-handlers/';



const mongoDbStart = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URL!)
        console.log("connected to db")
    } catch (e) {
        console.log(e)
        // throw new DBConnectionError()
    }

}
export function app(database: Function | null) {
    const app = express();

    app.use(morgan('dev'))
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    database ? database() : mongoDbStart()

    

    //routes
    app.use('/', handle(apiRoutes))


    //error for page not found
    app.use((req: Request, res: Response, next: NextFunction) => {
        const error = new PageNotFoundError()
        next(error);
    });

    //global error response--just throw error
    app.use(ErrorHandler);


    return app
}
