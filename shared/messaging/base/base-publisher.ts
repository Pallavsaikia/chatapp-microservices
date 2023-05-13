import { RabbitMqClient } from "./client-rabbitmq";
import { RoutingKey } from "../routing";
import { Event } from "./base-event";
import { Replies } from "amqplib";


export abstract class Publisher<T extends Event>  {
    private client: RabbitMqClient
    abstract routingKey: RoutingKey
    abstract mandatory: boolean | null
    abstract persistent: boolean | null
    abstract expiration: number | null
    abstract onFail(err: any, ok: Replies.Empty): void
    abstract onSuccess(err: any, ok: Replies.Empty): void
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
                Buffer.from(JSON.stringify(msg)),
                {
                    mandatory: this.mandatory ? this.mandatory : true,
                    persistent: this.persistent ? this.persistent : true,
                    expiration: this.expiration ? this.expiration : 150000
                }, (err: any, ok: Replies.Empty) => {
                    if (err) {
                        this.onFail(err, ok)
                    } else {
                        this.onSuccess(err, ok)
                    }

                })
        } catch (e) {
            console.log(e)
        }
        return false
    }



}
