import { Event } from "./events";
import { DynamoEventStore } from "../infrastructure/dynamoEventStore";
import {RecordEvent} from "../infrastructure/recordEvent";

const dynamoEventStore = new DynamoEventStore()

export interface EventStore {
    save(streamId: String, expectedVersion: number, events: Event[]): (Context) => Promise<any>
    load(streamId: String): Promise<RecordEvent[]>
}


export function eventStore() {
    return dynamoEventStore;
}
