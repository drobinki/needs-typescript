import {Event, HelloCreated} from "./events";


export function createHello(userId: string, comment: string): Event[] {
    return [new HelloCreated(userId, comment)]
}
