// const https = require('https');
import http from 'http'
import { app } from './app'
import { RabbitMqMetaData } from './config';
import { RabbitMq } from './messaging';

const port = process.env.PORT || 3000;

const rabbitmqFn = async () => {
    const { success, rabbitmq } = await new RabbitMq(RabbitMqMetaData.QUEUE_URL, RabbitMqMetaData.QUEUE_NAME).connnectAndCreateChannel()
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