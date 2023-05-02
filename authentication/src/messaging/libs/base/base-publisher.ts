import { ConsumeMessage } from "amqplib";
import { RabbitMqClient } from "./client-rabbitmq";
import { RoutingKey } from "../routing";
import { Event } from "./base-event";


export abstract class Publisher<T extends Event>  {
    private client: RabbitMqClient
    abstract routingKey: RoutingKey
    constructor(client: RabbitMqClient) {
        this.client = client
    }

    publish(msg: T['data']) {
        if (!this.client.channel) {
            console.log("channel not created")
            return false
        }
        try {
            return this.client.channel.publish(this.client.exchangeName,
                this.routingKey.toString(),
                Buffer.from(JSON.stringify(msg)))
        } catch (e) {
            console.log(e)
        }
        return false
    }



}
