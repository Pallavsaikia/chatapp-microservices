// const https = require('https');
import http from 'http'
import { app } from './app'
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

const port = process.env.PORT || 3000;

const rabbitmqFn = async () => {
    const routingKeys = new RoutingKey(RabbitMqService.authService,
        RabbitMqEntity.user,
        RabbitMqEvent.registration,
        RabbitMqAction.verified)
    const { success, rabbitmq } = await new RabbitMq(Config.MESSAGIN_QUEUE_URL,
        ExchangeName.chatApp,
        routingKeys,
        RabbitMqExchangeType.Fanout)
        .connectAndCreateChannel()
    if (!success) {
        console.log("couldnot start messaging queue")
        process.exit(0)
    } else {
        console.log("messaging queue started")
        return rabbitmq
    }
}

async function server() {
    const server = http.createServer(app(null, await rabbitmqFn()));
    server.listen(port);
}

server()