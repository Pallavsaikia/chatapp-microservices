
import { RabbitMqService, RabbitMqEntity, RabbitMqEvent, RabbitMqAction } from "../routes";
import { RoutingKeyStruct } from "./";


export class RoutingKey implements RoutingKeyStruct {
    service: RabbitMqService
    entity: RabbitMqEntity
    event: RabbitMqEvent
    action: RabbitMqAction


    constructor(service: RabbitMqService,
        entity: RabbitMqEntity,
        event: RabbitMqEvent,
        action: RabbitMqAction) {
        this.service = service
        this.entity = entity
        this.action = action
        this.event = event
    }
    toString() {
        return this.service + "." + this.entity + "." + this.event + "." + this.action
    }
}

