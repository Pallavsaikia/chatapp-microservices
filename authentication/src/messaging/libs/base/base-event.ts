import { RoutingKeyStruct } from "../routing";

export interface Event {
    route: RoutingKeyStruct,
    data: any
}
