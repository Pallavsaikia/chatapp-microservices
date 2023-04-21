import amqplib, { Connection, Channel } from "amqplib"


export class RabbitMq {
    url: string
    connection?: Connection
    channel?: Channel
    queueName: string
    constructor(url: string, queueName: string) {
        this.url = url
        this.queueName = queueName
    }
    async connect() {
        try {
            this.connection = await amqplib.connect(this.url)
        } catch (e) {
            console.log(e)
        }

    }

    async createChannel() {
        if (!this.connection) {
            console.log("connection required")
            return
        }
        try {
            this.channel = await this.connection?.createChannel()
            await this.channel.assertQueue(this.queueName, { durable: false })
        } catch (e) {
            console.log(e)
        }
    }

    async send(msg: any) {
        if (!this.channel) {
            console.log("channel not created")
            return
        }
        this.channel.sendToQueue(this.queueName, Buffer.from(msg))
    }


    async disconnect() {
        try {
            this.disconnect()
        } catch (e) {
            console.log(e)
        }
    }
}