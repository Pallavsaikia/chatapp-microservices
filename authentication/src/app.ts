import express, { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose';
import { app as apiRoutes } from './routes'
import { ErrorHandler, PageNotFoundError } from './middleware/error-handlers/';
import { Config } from './config';
import { RabbitMq } from './messaging';
import helmet from 'helmet'



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
    //helmet
    app.use(helmet.hidePoweredBy());
    app.use(morgan('dev'))
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    //access control--cors error handling
    app.use((req, res, next) => {

        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type , Accept , Authorization,cache-control,pragma,expires");
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT , POST , PATCH, DELETE, GET');
            return res.status(200).json({});
        }
        next();
    });

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

