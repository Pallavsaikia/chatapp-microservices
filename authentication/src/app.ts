import express from 'express'
import morgan from 'morgan'

export function app() {
    const app = express();
    app.use(morgan('dev'))

    app.get('/', (req, res) => {
        res.send('hello world')
    })
    
    return app
}
