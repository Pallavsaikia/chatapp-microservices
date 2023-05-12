// const https = require('https');
import http from 'http'
import { app } from './app'
import mongoose from 'mongoose';
import { ExchangeName, rabbitMQ } from '@pschatapp/messaging'
import { Config } from './config';
import { UserVerifiedEventListener } from './messaging';

const port = process.env.PORT || Config.PORT;

const rabbitmqFn = async () => {

    return rabbitMQ.connectConfirm(Config.RABBITMQ_URL, ExchangeName.chatApp)

}

async function database() {
    try {
        await mongoose.connect(Config.MONGO_URL)
        console.log("connected to db")
    } catch (e) {
        console.log(e)
        process.exit(0)
    }

}

function closeServerEvents() {


    process.on('SIGINT', () => {
        console.debug("closing server and rabbitmq")
        rabbitMQ.disconnectConfirm()
        process.exit(1)
    })


    process.on('uncaughtException', function (err) {
        console.debug("[Uncaught exception]")
        console.error(err);
        rabbitMQ.disconnectConfirm()
        process.exit()
    })


}

async function server() {
    await rabbitmqFn()
    new UserVerifiedEventListener().subscribe()
    const server = http.createServer(app(database));
    closeServerEvents()
    server.listen(port);
}

server()