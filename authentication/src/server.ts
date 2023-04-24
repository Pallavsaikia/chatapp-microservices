// const https = require('https');
import http from 'http'
import { app } from './app'
import { RabbitMq, RabbitMqQueue } from './messaging';
import { Config } from './config';

const port = process.env.PORT || 3000;

const rabbitmqFn = async () => {
    const { success, rabbitmq } = await new RabbitMq(Config.MESSAGIN_QUEUE_URL, RabbitMqQueue.USER_REGISTERED).connnectAndCreateChannel()
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