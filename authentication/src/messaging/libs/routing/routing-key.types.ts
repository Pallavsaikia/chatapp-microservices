import { RabbitMqAction, RabbitMqEntity, RabbitMqEvent, RabbitMqService } from "../routes";

export interface RoutingKeyStruct {
    service: RabbitMqService ,
    action: RabbitMqAction,
    entity: RabbitMqEntity,
    event: RabbitMqEvent
}