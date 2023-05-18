import { RabbitMqClient } from "./client-rabbitmq";
import { RoutingKey } from "../routing";
import { Event } from "./base-event";
import { Replies } from "amqplib";
import { RabbitMqQueues } from "../queues";


export abstract class Publisher<T extends Event>  {
    private client: RabbitMqClient
    abstract routingKey: RoutingKey
    abstract mandatory: boolean | null
    abstract persistent: boolean | null
    abstract expiration: number | null
    /**
     * can start queue and bind to exchange before producing
     */
    abstract rabbitmqQueues: RabbitMqQueues[]
    abstract onFail(err: any, ok: Replies.Empty | null): void
    abstract onSuccess(err: any, ok: Replies.Empty): void


    constructor(client: RabbitMqClient) {
        this.client = client
    }

    async publish(msg: T['data']) {

        try {
            if (!this.client.channel) {
                console.log("channel not created")
                this.onFail(new Error("channel not created"), null)
                return false
            }
            for (let i = 0; i < this.rabbitmqQueues.length; i++) {
                const { success, error } = await this.client.assertBindExchangeAndQueue(this.rabbitmqQueues[i], this.routingKey)
                if (!success) {
                    this.onFail(error, null)
                    return false
                }
            }



            this.client.channel.publish(this.client.exchangeName,
                this.routingKey.toString(),
                Buffer.from(JSON.stringify(msg)),
                {
                    mandatory: this.mandatory ? this.mandatory : true,
                    persistent: this.persistent ? this.persistent : true,
                    expiration: this.expiration ? this.expiration : 604800000
                }, (err: any, ok: Replies.Empty) => {
                    if (err) {
                        this.onFail(err, ok)
                    } else {
                        this.onSuccess(err, ok)
                    }

                })
        } catch (e) {
            this.onFail(e, null)
        }
        return false
    }



}
