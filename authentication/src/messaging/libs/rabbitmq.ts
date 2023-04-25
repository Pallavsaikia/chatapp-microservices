import amqplib, { Connection, Channel, Replies } from "amqplib"
import { ExchangeName } from "./exchange-name"
import { RabbitMqExchangeType } from "./rabbitmq-exchangetype"
import { RoutingKeyStruct } from "./routing"

interface RabbitMqReturn {
    success: boolean,
    rabbitmq: RabbitMq
}

interface MessagingImplementation {
    url: string
    connection?: Connection
    channel?: Channel
    exchangeName: ExchangeName
    exchangeType: RabbitMqExchangeType
    queue?: Replies.AssertQueue

    connect(): Promise<RabbitMqReturn>
    createChannel(): Promise<RabbitMqReturn>
    connectAndCreateChannel(): Promise<RabbitMqReturn>
    publish(msg: string): Promise<boolean>
    consume(fn: (msg: Buffer) => void): void
    disconnect(): void
}

export class RabbitMq implements MessagingImplementation {
    url: string
    connection?: Connection
    channel?: Channel

    exchangeName: ExchangeName
    exchangeType: RabbitMqExchangeType
    queue?: Replies.AssertQueue
    routingKey: RoutingKeyStruct
    constructor(url: string, exchangeName: ExchangeName, routingKey: RoutingKeyStruct, exchangeType: RabbitMqExchangeType | null) {
        this.url = url
        this.exchangeName = exchangeName
        this.routingKey = routingKey
        this.exchangeType = exchangeType ? exchangeType : RabbitMqExchangeType.Topic

    }

    async connect(): Promise<RabbitMqReturn> {
        try {
            this.connection = await amqplib.connect(this.url)
            return { success: true, rabbitmq: this }
        } catch (e) {
            this.disconnect()
            console.log(e)
        }
        return { success: false, rabbitmq: this }
    }

    async createChannel(): Promise<RabbitMqReturn> {
        if (!this.connection) {
            console.log("connection required")
            return { success: false, rabbitmq: this }
        }
        try {
            this.channel = await this.connection?.createChannel()
            await this.channel.assertExchange(this.exchangeName, this.exchangeType, { durable: false })
            return { success: true, rabbitmq: this }
        } catch (e) {
            this.disconnect()
            console.log(e)
        }
        return { success: false, rabbitmq: this }
    }

    async connectAndCreateChannel(): Promise<RabbitMqReturn> {
        try {
            this.connection = await amqplib.connect(this.url)
            this.channel = await this.connection.createChannel()
            await this.channel.assertExchange(this.exchangeName, this.exchangeType, { durable: false })
            return { success: true, rabbitmq: this }
        } catch (e) {
            this.disconnect()
            console.log(e)
        }
        return { success: false, rabbitmq: this }
    }

    async publish(msg: string): Promise<boolean> {
        if (!this.channel) {
            console.log("channel not created")
            return false
        }
        try {
            this.channel.publish(this.exchangeName, this.routingKey.toString(), Buffer.from(msg));
            return true
        } catch (e) {
            console.log(e)
        }
        return false
    }


    async consume(fn: (msg: Buffer) => void) {
        if (!this.channel) {
            console.log("channel not created")
            return false
        }
        console.log(`waiting for messsages at --------- ${this.routingKey.toString()}`)
        this.queue = await this.channel.assertQueue('', { exclusive: true });
        this.channel.bindQueue(this.queue.queue, this.exchangeName, this.routingKey.toString())
        this.channel.consume(this.queue.queue, (msg) => {
            if (msg === null) {
                return
            }
            if (msg.content) {
                console.log(`Routing Key: ${msg.fields.routingKey}, Message: ${msg.content.toString()}`);
                fn(msg.content)
            }
        }, { noAck: true })
    }

    async disconnect() {

        try {
            this.connection?.close()
        } catch (e) {
            console.log(e)
        }
    }

}