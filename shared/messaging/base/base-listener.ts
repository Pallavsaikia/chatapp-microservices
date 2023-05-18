import { ConsumeMessage } from "amqplib";
import { RabbitMqClient } from "./client-rabbitmq";
import { RoutingKey } from "../routing";
import { Event } from "./base-event";


export abstract class Listener<T extends Event>  {
    private client: RabbitMqClient
    abstract routingKey: RoutingKey
    abstract onMessage(msg: T['data'], msgbfr: ConsumeMessage): void
    abstract exclusive: boolean | null
    abstract durable: boolean | null
    abstract autoDelete: boolean | null
    abstract expires: number | null
    abstract queueName: string | null
    constructor(client: RabbitMqClient) {
        this.client = client
    }

    async subscribe() {
        if (!this.client.channel) {
            console.log("channel not created")
            return false
        }
        console.log(`waiting for messsages at --------- ${this.routingKey.toString()}`)
        this.client.queue = await this.client.channel.assertQueue(this.queueName ? this.queueName : '', {
            exclusive: this.exclusive ? this.exclusive : false,
            durable: this.durable ? this.durable : true,
            autoDelete: this.autoDelete ? this.autoDelete : false,
            expires: this.expires ? this.expires : 604800000 //7 days
        });
        const { success, error } = await this.client.assertExchange()
        if (!success) {
            console.log(error)
            return false
            
        }
        this.client.channel.bindQueue(this.client.queue.queue, this.client.exchangeName, this.routingKey.toString())
        this.client.channel.consume(this.client.queue.queue, (msg) => {
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
