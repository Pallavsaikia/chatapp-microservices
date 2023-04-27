// const https = require('https');
import http from 'http'
import { app } from './app'
import mongoose from 'mongoose';
import {
    ExchangeName,
    RabbitMq,
    RabbitMqAction,
    RabbitMqEntity,
    RabbitMqEvent,
    RabbitMqService,
    RoutingKey,
    RabbitMqExchangeType
} from './messaging';
import { Config } from './config';

const port = process.env.PORT || Config.PORT;

const rabbitmqFn = async () => {
    const routingKeys = new RoutingKey(RabbitMqService.authService,
        RabbitMqEntity.user,
        RabbitMqEvent.registration,
        RabbitMqAction.verified)
    const { success, rabbitmq } = await new RabbitMq(Config.MESSAGIN_QUEUE_URL,
        ExchangeName.chatApp,
        routingKeys,
        RabbitMqExchangeType.Topic)
        .connectAndCreateChannel()
    if (!success) {
        console.log("couldnot start messaging queue")
        process.exit()
    } else {
        console.log("messaging queue started")
        return rabbitmq
    }
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

function closeServerEvents(rabbitmq: RabbitMq, server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {

    
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
    const rabbitmq = await rabbitmqFn()
    const server = http.createServer(app(database, rabbitmq));
    closeServerEvents(rabbitmq, server)


    server.listen(port);
}

server()