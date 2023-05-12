
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



export class UserVerifiedEventPublisher extends Publisher<UserVerifiedEvent>{
    routingKey: RoutingKey
    constructor() {
        rabbitMQ
        super(rabbitMQ.client)
        this.routingKey = new RoutingKey(RabbitMqService.authService, RabbitMqEntity.user, RabbitMqEvent.registration, RabbitMqAction.verified)
    }

}