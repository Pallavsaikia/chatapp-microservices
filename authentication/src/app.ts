import express, { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose';
import { app as apiRoutes } from './routes'
import { DBConnectionError, ErrorHandler, PageNotFoundError } from './middleware/error-handlers/';
import { Config, RabbitMqMetaData } from './config';
import { RabbitMq } from './messaging';




const mongoDbStart = async () => {
    try {
        await mongoose.connect(Config.MONGO_URL)
        console.log("connected to db")
    } catch (e) {
        console.log(e)
        process.exit(0)
    }

}


export function app(database: Function | null, rabbitmq: RabbitMq | null) {
    const app = express();

    app.use(morgan('dev'))
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    database ? database() : mongoDbStart()



    app.use(async (req: Request, res: Response, next: NextFunction) => {
        if (rabbitmq !== null) {
            res.locals.rabbitmq = rabbitmq
        }
        next()
    });


    //routes
    app.use('/', apiRoutes)


    //error for page not found
    app.use((req: Request, res: Response, next: NextFunction) => {
        const error = new PageNotFoundError()
        next(error);
    });

    //global error response--just throw error
    app.use(ErrorHandler);

    process.on('exit', async function (code) {
        return console.log(`exiting the code implicitly ${code}`);
    });

    return app
}

