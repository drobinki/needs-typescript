import {Event, HelloChanged} from "./events";


export function changeHello(hello: Hello, newComment: string): Event[] {
    return [new HelloChanged(hello.userId, newComment)]
}
