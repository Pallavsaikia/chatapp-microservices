// const https = require('https');
import http from 'http'
import { app } from './app'
import mongoose from 'mongoose';
import { ExchangeName, RabbitMQAttr,  rabbitMQ } from '@pschatapp/messaging';
import { Config } from './config';

const port = process.env.PORT || Config.PORT;

const rabbitmqFn = async () => {

    return rabbitMQ.connect(Config.MESSAGIN_QUEUE_URL, ExchangeName.chatApp)

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

function closeServerEvents(rabbitmq: RabbitMQAttr, server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {


    process.on('SIGINT', () => {
        console.debug("closing server and rabbitmq")
        rabbitmq.disconnect()
        process.exit(1)
    })


    process.on('uncaughtException', function (err) {
        console.debug("[Uncaught exception]")
        console.error(err);
        rabbitmq.disconnect()
        process.exit()
    })


}

async function server() {
    await rabbitmqFn()
   
    const server = http.createServer(app(database));
    closeServerEvents(rabbitMQ, server)
    server.listen(port);
}

server()