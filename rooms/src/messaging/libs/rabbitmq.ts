import { rejects } from "assert"
import { ExchangeName } from "./exchange-name"
import { RabbitMqClient } from "./base"
import { RabbitMqExchangeType } from "./rabbitmq-exchangetype"

export interface RabbitMQAttr {
    get client(): RabbitMqClient
    get clientExist(): boolean
    connect(url: string, exchangeName: ExchangeName): Promise<Error | null>
    disconnect(): void
}
class RabbitMQ implements RabbitMQAttr {
    private _client?: RabbitMqClient

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
    async connect(url: string, exchangeName: ExchangeName): Promise<Error | null> {

        return new Promise(async (resolve, reject) => {
            const { success, rabbitmq, error } = await new RabbitMqClient(url,
                exchangeName,
                RabbitMqExchangeType.Topic)
                .connect()
            if (success) {
                resolve(null)
                this._client = rabbitmq
            } else {
                reject(error!)
            }

        })

    }

    async disconnect() {
        this._client?.disconnect()
    }
}

export const rabbitMQ = new RabbitMQ()