
import { RabbitMqService, RabbitMqEntity, RabbitMqEvent, RabbitMqAction } from "../routes";
import {  RoutingKeyStruct } from "./";




class RoutingKeyGenerator {


    keyArray: (string | null)[]
    
    constructor(...args: (string | null)[]) {
        this.keyArray = args
    }

    toString() {
        const keyGen: string[] = []
        for (let i = 0; i < this.keyArray.length; i++) {
            if (this.keyArray[i] === null) {
                if (this.keyArray[i + 1] === null) {
                    while (this.keyArray[i + 1] === null) {
                        i++
                    }

                    keyGen.push("#")
                } else {
                    keyGen.push("*")
                }
            } else {
                keyGen.push(this.keyArray[i]!)
            }
        }
        return keyGen.reduce((previousvalue: string, currentvalue: string) => previousvalue + "." + currentvalue)
    }

}


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


