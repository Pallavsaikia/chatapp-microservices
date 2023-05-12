
import {
    rabbitMQ,
    Publisher,
    RoutingKey,
    RabbitMqService,
    RabbitMqEntity,
    RabbitMqEvent,
    RabbitMqAction,
    UserVerifiedEvent

} from "@pschatapp/messaging"
import { Replies } from "amqplib"



export class UserVerifiedEventPublisher extends Publisher<UserVerifiedEvent>{
    routingKey: RoutingKey
    onSuccess(err: any, ok: Replies.Empty): void {
        console.log("success")
    }
    onFail(err: any, ok: Replies.Empty): void {
        console.log("fail", err)
    }
    constructor() {
        rabbitMQ
        super(rabbitMQ.client)
        this.routingKey = new RoutingKey(RabbitMqService.authService, RabbitMqEntity.user, RabbitMqEvent.registration, RabbitMqAction.verified)
    }

}