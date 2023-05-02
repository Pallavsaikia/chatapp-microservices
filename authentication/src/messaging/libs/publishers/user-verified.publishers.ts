import {  Publisher, RabbitMqClient } from "../base";
import {  UserVerifiedEvent } from "../events/user-verified.event";
import { rabbitMQ } from "../rabbitmq";
import { RabbitMqAction, RabbitMqEntity, RabbitMqEvent, RabbitMqService } from "../routes";
import { RoutingKey } from "../routing";


export class UserVerifiedEventPublisher extends Publisher<UserVerifiedEvent>{
    routingKey: RoutingKey
    constructor() {
        super(rabbitMQ.client)
        this.routingKey = new RoutingKey(RabbitMqService.authService, RabbitMqEntity.user, RabbitMqEvent.registration, RabbitMqAction.verified)
    }
    
}


