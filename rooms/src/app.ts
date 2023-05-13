import express, { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
// import { app as apiRoutes } from './routes'
import { ErrorHandler, PageNotFoundError } from '@pschatapp/middleware'
import helmet from 'helmet'






export function app(database: Function) {
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

    if(database){
        database()
    }else{
        process.exit()
    }




    //routes
    // app.use('/', apiRoutes)


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

