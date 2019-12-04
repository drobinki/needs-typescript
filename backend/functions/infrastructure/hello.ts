
import {HelloChanged, HelloCreated} from "../domain/events";
import {RecordEvent} from "./recordEvent";

function apply(state: any, created: RecordEvent) {
    let event = JSON.parse(created.event);
    switch (created.name) {
        case HelloCreated.name: {
            return {
                ...event
            }
        }
        case HelloChanged.name: {
            return {
                ...state,
                message: event.getNewMessage()
            }
        }
    }
}

export function toHello(events: RecordEvent[]): Hello {
    const hello = events
        .reduce((acc, event) => apply(acc, event), {});
    return hello
}
