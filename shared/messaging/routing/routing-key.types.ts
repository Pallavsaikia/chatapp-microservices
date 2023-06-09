import { RabbitMqAction, RabbitMqEntity, RabbitMqEvent, RabbitMqService } from "../routes";

export interface RoutingKeyStruct {
    service: RabbitMqService | null,
    entity: RabbitMqEntity | null,
    action: RabbitMqAction | null,
    event: RabbitMqEvent | null,
    toString(): string
}