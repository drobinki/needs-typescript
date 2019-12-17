import {Event} from "./events";


export function changeHello(hello: Hello, newComment: string): Event[] {
    return [{
        kind: "HelloChanged",
        userId: hello.userId,
        newMessage: newComment
    }]
}
