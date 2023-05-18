
import {
    rabbitMQ,
    Publisher,
    RoutingKey,
    RabbitMqService,
    RabbitMqEntity,
    RabbitMqEvent,
    RabbitMqAction,
    UserVerifiedEvent,
    userVerifiedQueue,
    RabbitMqQueues
} from "@pschatapp/messaging"
import { Replies } from "amqplib"



export class UserVerifiedEventPublisher extends Publisher<UserVerifiedEvent>{

    onSuccess(err: any, ok: Replies.Empty): void {
        console.log("success", err, ok)
    }
    onFail(err: any, ok: Replies.Empty): void {
        console.log("fail", err)
    }
    routingKey: RoutingKey
    expiration: number
    mandatory: boolean
    persistent: boolean
    rabbitmqQueues: RabbitMqQueues[]
    constructor() {
        super(rabbitMQ.client)
        this.routingKey = new RoutingKey(RabbitMqService.authService, RabbitMqEntity.user, RabbitMqEvent.registration, RabbitMqAction.verified)
        this.expiration = 150000
        this.mandatory = true
        this.persistent = true
        this.rabbitmqQueues = [userVerifiedQueue]
    }

}