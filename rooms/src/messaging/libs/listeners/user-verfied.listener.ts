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
    UserVerifiedAttr

} from "@pschatapp/messaging"
import { userRegistrationService } from "../../../db-services/user-registered";
import { Config } from "../../../config";




export class UserVerifiedEventListener extends Listener<UserVerifiedEvent>{
    exclusive?: boolean | undefined;
    durable?: boolean | undefined;
    autoDelete?: boolean | undefined;
    expires?: number | undefined;
    queueName?: string | undefined;

    routingKey: RoutingKey
    constructor() {
        super(rabbitMQ.client)
        this.routingKey = new RoutingKey(RabbitMqService.authService, RabbitMqEntity.user, RabbitMqEvent.registration, RabbitMqAction.verified)
        this.autoDelete = false
        this.exclusive = false
        this.queueName = Config.USER_VERIFIED_QUEUE
    }
    async onMessage(user: UserVerifiedAttr, msgbfr: ConsumeMessage): Promise<void> {
        console.log("message,", user._id)
        const { error } = await userRegistrationService(user)
        if (error) {
            console.log(error)
        }

    }
}
