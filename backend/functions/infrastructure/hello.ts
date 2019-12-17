
import {RecordEvent} from "./recordEvent";

function apply(state: any, recordEvent: RecordEvent) {
    let event = JSON.parse(recordEvent.event);
    switch (event.kind) {
        case "HelloCreated": {
            return {
                version: recordEvent.version,
                userId: event.userId,
                message: event.message
            }
        }
        case "HelloChanged": {
            return {
                ...state,
                version: recordEvent.version,
                message: event.newMessage
            }
        }
    }
}

export function toHello(events: RecordEvent[]): Hello {
    const hello = <Hello> events
        .reduce((acc, event) => apply(acc, event), {});
    return hello
}
