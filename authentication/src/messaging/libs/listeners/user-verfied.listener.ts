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




export class UserVerifiedEventListener extends Listener<UserVerifiedEvent>{
    routingKey: RoutingKey
    constructor() {
        super(rabbitMQ.client)
        this.routingKey = new RoutingKey(RabbitMqService.authService, RabbitMqEntity.user, RabbitMqEvent.registration, RabbitMqAction.verified)
    }
    onMessage(msg: UserVerifiedAttr, msgbfr: ConsumeMessage): void {
        console.log("message,",msg._id)
    }
}
