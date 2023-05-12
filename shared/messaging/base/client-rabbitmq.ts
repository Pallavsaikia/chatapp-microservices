import amqplib, { Connection, ConfirmChannel, Replies } from "amqplib"
import { ExchangeName } from "../exchange-name"
import { RabbitMqExchangeType } from "../rabbitmq-exchangetype"


interface RabbitMqReturn {
    success: boolean,
    error?: Error
    rabbitmq: RabbitMqClient
}




export abstract class RabbitMqClient {
    abstract url: string
    abstract exchangeName: ExchangeName
    abstract exchangeType: RabbitMqExchangeType
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
            await this.channel.assertExchange(this.exchangeName, this.exchangeType, { durable: false })
            return { success: true, rabbitmq: this }
        } catch (e) {
            this.disconnect()
            console.log(e)
            return { success: false, rabbitmq: this, error: e as Error }
        }
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
