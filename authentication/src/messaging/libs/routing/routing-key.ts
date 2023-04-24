
import { RoutingKeyStruct } from "./routing-key.types";


export function genRoutingKey(routingKeyStruct: RoutingKeyStruct) {
    return routingKeyStruct.service + "." + routingKeyStruct.action + "." + routingKeyStruct.entity + "." + routingKeyStruct.event
}