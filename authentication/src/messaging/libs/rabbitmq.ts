import amqplib, { Connection, Channel } from "amqplib"

interface RabbitMqReturn {
    success: boolean,
    rabbitmq: RabbitMq
}

interface MessagingImplementation {
    url: string
    connection?: Connection
    channel?: Channel
    queueName: string

    connect(): Promise<RabbitMqReturn>
    createChannel(): Promise<RabbitMqReturn>
    createChannel(): Promise<RabbitMqReturn>
    sendMsg(msg: any): Promise<RabbitMqReturn>
    connnectAndCreateChannel(): Promise<RabbitMqReturn>
    disconnect(): void
}

export class RabbitMq implements MessagingImplementation {
    url: string
    connection?: Connection
    channel?: Channel
    queueName: string
    constructor(url: string, queueName: string) {
        this.url = url
        this.queueName = queueName
       
    }

    async connect(): Promise<RabbitMqReturn> {
        try {
            this.connection = await amqplib.connect(this.url)
            return { success: true, rabbitmq: this }
        } catch (e) {
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
            await this.channel.assertQueue(this.queueName, { durable: false })
            return { success: true, rabbitmq: this }
        } catch (e) {
            console.log(e)
        }
        return { success: false, rabbitmq: this }
    }

    async sendMsg(msg: any): Promise<RabbitMqReturn> {
        if (!this.channel) {
            console.log("channel not created")
            return { success: false, rabbitmq: this }
        }
        this.channel.sendToQueue(this.queueName, Buffer.from(msg))
        return { success: true, rabbitmq: this }
    }


    async connnectAndCreateChannel(): Promise<RabbitMqReturn> {
        try {
            this.connection = await amqplib.connect(this.url)
            if (!this.connection) {
                console.log("connection required")
                return { success: false, rabbitmq: this }
            }
            this.channel = await this.connection?.createChannel()
            await this.channel.assertQueue(this.queueName, { durable: false })
            return { success: true, rabbitmq: this }
        } catch (e) {
            console.log(e)
        }
        return { success: false, rabbitmq: this }
    }

    async disconnect() {
        try {
            this.disconnect()
        } catch (e) {
            console.log(e)
        }
    }
}