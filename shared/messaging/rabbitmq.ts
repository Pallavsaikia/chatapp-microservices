import { ExchangeName } from "./exchange-name"
import { RabbitMqClient } from "./base"
import { RabbitMqExchangeType } from "./rabbitmq-exchangetype"

export interface RabbitMQAttr {
    get client(): RabbitMqClient
    get clientExist(): boolean
    connect(url: string, exchangeName: ExchangeName): Promise<Error | null>
    disconnect(): void
}
class RabbitMQ extends RabbitMqClient {

    private _client?: RabbitMqClient
    url!: string
    exchangeName!: ExchangeName
    exchangeType: RabbitMqExchangeType = RabbitMqExchangeType.Topic
    durableExchange!: boolean



    get client() {
        if (!this._client) {
            throw new Error("cannot access/connect rabbitmq channel")
        }
        return this._client!
    }

    get clientExist() {
        if (!this._client) {
            return false
        }
        return true
    }

    async connectConfirm(url: string, exchangeName: ExchangeName, durableExchange?: boolean): Promise<Error | null> {
        this.url = url
        this.exchangeName = exchangeName
        this.durableExchange = durableExchange ? durableExchange : true
        return new Promise(async (resolve, reject) => {
            const { success, rabbitmq, error } = await this.connect()
            if (success) {
                resolve(null)
                this._client = rabbitmq
            } else {
                reject(error!)
            }

        })

    }
    async deleteExchangeConfirm() {
        this.deleteExchange()
    }
    async disconnectConfirm() {
        this.disconnect()
    }
}

export const rabbitMQ = new RabbitMQ()