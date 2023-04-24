import { Config } from "../config"
import { ExchangeName, RabbitMq, RabbitMqAction, RabbitMqEntity, RabbitMqEvent, RabbitMqExchangeType, RabbitMqService, RoutingKey } from "."


async function get() {
    const routingKeys = new RoutingKey(RabbitMqService.authService,
        RabbitMqEntity.user,
        RabbitMqEvent.registration,
        RabbitMqAction.verified)
    const { success, rabbitmq } = await new RabbitMq(Config.MESSAGIN_QUEUE_URL,
        ExchangeName.chatApp,
        routingKeys,
        RabbitMqExchangeType.Fanout)
        .connectAndCreateChannel()
     

    if (!success) {
        console.log("couldnot start messaging queue")
        process.exit(0)
    } else {
        console.log("messaging queue started")
        rabbitmq.consume((msg) => {
            console.log(msg.toString())
        })
        return rabbitmq
    }
}

get()