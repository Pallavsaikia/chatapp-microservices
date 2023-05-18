import amqplib, { Connection, ConfirmChannel, Replies } from "amqplib"
import { ExchangeName } from "../exchange-name"
import { RabbitMqExchangeType } from "../rabbitmq-exchangetype"


interface RabbitMqReturn {
    success: boolean,
    error?: Error
    rabbitmq: RabbitMqClient
}

interface AssertExchangeReturn {
    success: boolean,
    error: Error | null
}


export abstract class RabbitMqClient {
    abstract url: string
    abstract exchangeName: ExchangeName
    abstract exchangeType: RabbitMqExchangeType
    abstract durableExchange: boolean
    queue?: Replies.AssertQueue
    connection?: Connection
    channel?: ConfirmChannel

    constructor() { }

    protected async connect(): Promise<RabbitMqReturn> {

        try {
            if (!this.url) {
                this.disconnect()
                return { success: false, rabbitmq: this, error: new Error("no url found") }
            }
            if (!this.exchangeName) {
                this.disconnect()
                return { success: false, rabbitmq: this, error: new Error("no exchange name found") }
            }
            this.connection = await amqplib.connect(this.url)
            this.channel = await this.connection.createConfirmChannel()
            await this.assertExchange()
            return { success: true, rabbitmq: this }
        } catch (e) {
            this.disconnect()
            console.log(e)
            return { success: false, rabbitmq: this, error: e as Error }
        }
    }


    async assertExchange(): Promise<AssertExchangeReturn> {
        if (!this.channel) {
            return { success: false, error: new Error("no channel") }
        }
        try {
            await this.channel.assertExchange(this.exchangeName, this.exchangeType, { durable: this.durableExchange })
            return { success: true, error: null }
        } catch (e) {
            return { success: false, error: new Error("no channel") }
        }

    }

    protected async deleteExchange() {
        try {
            if (!this.exchangeName) {
                this.disconnect()
                return false
            }
            await this.channel?.deleteExchange(this.exchangeName)
        } catch (e) {
            console.log(e)
            return false
        }
        return true
    }


    protected async disconnect() {

        try {
            if (this.connection) {
                this.connection.removeAllListeners()
                this.connection.close()
            }

        } catch (e) {
            console.log(e)
        }
    }

}
