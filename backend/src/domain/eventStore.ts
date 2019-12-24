import { Event } from "./events";
import { DynamoEventStore } from "../infrastructure/dynamoEventStore";
import {RecordEvent} from "../infrastructure/recordEvent";

const dynamoEventStore = new DynamoEventStore()

export interface EventStore {
    save(streamId: string, expectedVersion: number, events: Event[]): (context: EventContext) => Promise<any>
    load(streamId: string): Promise<RecordEvent[]>
    all(): Promise<RecordEvent[]>
}

export interface EventContext {
    correlationId: string,
    causationId: string,
    aggregate: AggregateTypes
}

export function eventStore() {
    return dynamoEventStore;
}

export enum AggregateTypes {
    Hello = "Hello"
}
