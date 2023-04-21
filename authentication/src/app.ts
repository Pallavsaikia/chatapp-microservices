import express, { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose';
import { app as apiRoutes } from './routes'
import { DBConnectionError, ErrorHandler, PageNotFoundError } from './middleware/error-handlers/';
import { Config } from './config';
import { RabbitMq } from './messaging';




const mongoDbStart = async () => {
    try {
        const db = await mongoose.connect(Config.MONGO_URL)
        console.log("connected to db")
    } catch (e) {
        console.log(e)
        // throw new DBConnectionError()
    }

}
// const sendMsg = async () => {
//     const rabbitMq = new RabbitMq("amqp://user:HvDxHHJAqRuikn0O@localhost:30221", "test")
//     await rabbitMq?.connect()
//     await rabbitMq?.createChannel()
//     await rabbitMq?.send("test")
// }
export function app(database: Function | null) {
    const app = express();

    app.use(morgan('dev'))
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    database ? database() : mongoDbStart()

    

    //routes
    app.use('/', apiRoutes)


    //error for page not found
    app.use((req: Request, res: Response, next: NextFunction) => {
        const error = new PageNotFoundError()
        next(error);
    });

    //global error response--just throw error
    app.use(ErrorHandler);


    return app
}
