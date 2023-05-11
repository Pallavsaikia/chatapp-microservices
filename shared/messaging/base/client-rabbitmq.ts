import amqplib, { Connection, Channel, Replies } from "amqplib"
import { ExchangeName } from "../exchange-name"
import { RabbitMqExchangeType } from "../rabbitmq-exchangetype"


interface RabbitMqReturn {
    success: boolean,
    error?: Error
    rabbitmq: RabbitMqClient
}



export class RabbitMqClient  {
    url: string
    connection?: Connection
    channel?: Channel

    exchangeName: ExchangeName
    exchangeType: RabbitMqExchangeType
    queue?: Replies.AssertQueue
    constructor(url: string, exchangeName: ExchangeName, exchangeType: RabbitMqExchangeType | null) {
        this.url = url
        this.exchangeName = exchangeName

        this.exchangeType = exchangeType ? exchangeType : RabbitMqExchangeType.Topic

    }

    async connect(): Promise<RabbitMqReturn> {
        try {
            this.connection = await amqplib.connect(this.url)
            this.channel = await this.connection.createChannel()
            await this.channel.assertExchange(this.exchangeName, this.exchangeType, { durable: false })
            return { success: true, rabbitmq: this }
        } catch (e) {
            this.disconnect()
            console.log(e)
            return { success: false, rabbitmq: this, error: e as Error }
        }
    }






    async disconnect() {

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