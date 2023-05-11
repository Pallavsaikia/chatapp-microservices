
import { RabbitMqService, RabbitMqEntity, RabbitMqEvent, RabbitMqAction } from "../routes";
import {  RoutingKeyStruct } from "./routing-key.types";
import { RoutingKeyGenerator } from "./routing-key-gen";





export class RoutingKeyExpression extends RoutingKeyGenerator implements RoutingKeyStruct {

    service: RabbitMqService | null
    entity: RabbitMqEntity | null
    event: RabbitMqEvent | null
    action: RabbitMqAction | null


    constructor(service: RabbitMqService | null,
        entity: RabbitMqEntity | null,
        event: RabbitMqEvent | null,
        action: RabbitMqAction | null) {
        super(service, entity, event, action)
        this.service = service
        this.entity = entity
        this.action = action
        this.event = event

    }

    toString() {
        return super.toString()
    }
}


