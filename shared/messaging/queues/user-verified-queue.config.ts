
import { RabbitMqQueues } from "./queue.types";

class UserVerifiedQueue implements RabbitMqQueues {
    readonly queueName = "UserVerifiedQueue"
    readonly exclusive = false
    readonly durable = true
    readonly autoDelete = false
    readonly expires = 604800000
      constructor() {

    }
}

export const userVerifiedQueue = new UserVerifiedQueue()