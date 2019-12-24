import {Event, EventKinds} from "./events";
import {RecordEvent} from "../infrastructure/recordEvent";

export interface HelloState {
    userId: string;
    version: number,
    message: string;
}

export function createHello(userId: string, comment: string): Event[] {
    return [{
        kind: EventKinds.HelloCreated,
        userId: userId,
        message: comment
    }]
}


export function changeHello(hello: HelloState, newComment: string): Event[] {
    return [{
        kind: EventKinds.HelloChanged,
        userId: hello.userId,
        newMessage: newComment
    }]
}

export function toHello(events: RecordEvent[]): HelloState {
    const hello = events
        .reduce<HelloState>((acc, event) => apply(acc, event), {message: "", userId: "", version: 0});
    return hello
}

function apply(state: any, recordEvent: RecordEvent): HelloState {
    let event: Event = JSON.parse(recordEvent.event);
    switch (event.kind) {
        case EventKinds.HelloCreated: {
            return {
                version: recordEvent.version,
                userId: event.userId,
                message: event.message
            }
        }
        case EventKinds.HelloChanged: {
            return {
                ...state,
                version: recordEvent.version,
                message: event.newMessage
            }
        }
    }
}
