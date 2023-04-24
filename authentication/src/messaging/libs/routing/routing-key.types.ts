import { RabbitMqAction, RabbitMqEntity, RabbitMqEvent, RabbitMqService } from "../routes";

export interface RoutingKeyStruct {
    service: RabbitMqService ,
    entity: RabbitMqEntity,
    action: RabbitMqAction,
    event: RabbitMqEvent,
    toString():void
}