import { ConsumeMessage, Replies } from "amqplib";
import { RabbitMqClient } from "./client-rabbitmq";
import { RoutingKey } from "../routing";
import { Event } from "./base-event";
import { RabbitMqQueues } from "../queues";


export abstract class Listener<T extends Event>  {
    private client: RabbitMqClient
    abstract routingKey: RoutingKey
    abstract onMessage(msg: T['data'], msgbfr: ConsumeMessage): void
    abstract rabbitmqQueues: RabbitMqQueues
    private queue!: Replies.AssertQueue
    constructor(client: RabbitMqClient) {
        this.client = client
    }

    async subscribe() {
        if (!this.client.channel) {
            console.log("channel not created")
            return false
        }
        console.log(`waiting for messsages at --------- ${this.routingKey.toString()}`)
        const { success, queue, error } = await this.client.assertBindExchangeAndQueue(this.rabbitmqQueues, this.routingKey)
        if (!success) {
            throw error

        }
        this.queue = queue!
        this.client.channel.consume(this.queue.queue, (msg) => {
            if (msg !== null) {
                console.log(msg.content.toString())
                this.onMessage(this.parsedData(msg), msg)
            }

        }, { noAck: true })
    }


    parsedData(msg: ConsumeMessage) {
        console.log(`Routing Key: ${msg.fields.routingKey}, Message: ${msg.content.toString()}`);
        const data = msg.content
        return typeof data === "string" ?
            JSON.parse(data) :
            JSON.parse(data.toString('utf8'))
    }

}
