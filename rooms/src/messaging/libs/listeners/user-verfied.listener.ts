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
    exclusive: boolean | null;
    durable: boolean | null;
    autoDelete: boolean | null;
    expires: number | null;
    queueName: string | null;

    routingKey: RoutingKey
    constructor() {
        super(rabbitMQ.client)
        this.routingKey = new RoutingKey(RabbitMqService.authService, RabbitMqEntity.user, RabbitMqEvent.registration, RabbitMqAction.verified)
        this.autoDelete = false
        this.durable = true
        this.exclusive = false
        this.expires = 604800000 //7 days
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
