import { ConsumeMessage } from "amqplib";
import {
    rabbitMQ,
    Listener,
    RoutingKey,
    RabbitMqService,
    RabbitMqEntity,
    RabbitMqEvent,
    RabbitMqAction,
    UserVerifiedEvent,
    UserVerifiedAttr,
    RabbitMqQueues,
    userVerifiedQueue

} from "@pschatapp/messaging"
import { userRegistrationService } from "../../../db-services/user-registered";




export class UserVerifiedEventListener extends Listener<UserVerifiedEvent>{

    rabbitmqQueues: RabbitMqQueues;
    routingKey: RoutingKey
    constructor() {
        super(rabbitMQ.client)
        this.routingKey = new RoutingKey(RabbitMqService.authService, RabbitMqEntity.user, RabbitMqEvent.registration, RabbitMqAction.verified)
        this.rabbitmqQueues = userVerifiedQueue
    }
    async onMessage(user: UserVerifiedAttr, msgbfr: ConsumeMessage): Promise<void> {
        console.log("message,", user._id)
        const { error } = await userRegistrationService(user)
        if (error) {
            console.log(error)
        }

    }
}
