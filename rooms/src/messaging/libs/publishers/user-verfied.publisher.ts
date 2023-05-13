
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
    mandatory?: boolean | undefined
    persistent?: boolean | undefined
    expiration?: number | undefined
    routingKey: RoutingKey

    onSuccess(err: any, ok: Replies.Empty): void {
        console.log("success")
    }
    onFail(err: any, ok: Replies.Empty): void {
        console.log("fail", err)
    }
    constructor() {
        super(rabbitMQ.client)
        this.routingKey = new RoutingKey(RabbitMqService.authService, RabbitMqEntity.user, RabbitMqEvent.registration, RabbitMqAction.verified)
      
    }

}