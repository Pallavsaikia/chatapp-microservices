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
import { Console } from 'console';

const port = process.env.PORT || 3000;

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
function processEvents(rabbitmq: RabbitMq) {

    process.on('SIGINT', () => {
        console.log("disconnecting rabbitmq")
        rabbitmq.disconnect()
    })
    process.on('SIGTERM', () => {
        console.log("disconnecting rabbitmq")
        rabbitmq.disconnect()
    })

    process.on('uncaughtException', function (err) {
        console.debug("[Uncaught exception]")
        console.error(err);
        process.exit(1)
    })

}

async function server() {
    const rabbitmq = await rabbitmqFn()
    const server = http.createServer(app(null, rabbitmq));
    processEvents(rabbitmq)
    server.listen(port);


}

server()