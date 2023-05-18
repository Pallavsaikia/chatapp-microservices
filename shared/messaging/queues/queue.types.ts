import { RoutingKey } from "../routing"

export type  RabbitMqQueues ={
    queueName: string
    exclusive: boolean 
    durable: boolean 
    autoDelete: boolean 
    expires: number
    
}