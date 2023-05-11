import { ConsumeMessage } from "amqplib";
import { Listener, RabbitMqClient } from "../base";
import { UserVerifiedAttr, UserVerifiedEvent } from "../events/user-verified.event";
import { RabbitMqAction, RabbitMqEntity, RabbitMqEvent, RabbitMqService } from "../routes";
import { RoutingKey } from "../routing";
import { rabbitMQ } from "../rabbitmq";


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


