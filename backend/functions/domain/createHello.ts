import {Event} from "./events";


export function createHello(userId: string, comment: string): Event[] {
    return [{
        kind: "HelloCreated",
        userId: userId,
        message: comment
    }]
}
