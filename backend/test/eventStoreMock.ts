import {EventContext, EventStore} from "../src/domain/eventStore";
import {RecordEvent} from "../src/infrastructure/recordEvent";
import {Event} from "../src/domain/events";

export class EventStoreMock implements EventStore {
    private _save: Save;
    private _load: Load;
    private _all: All;


    constructor(save:Save, load: Load, all:All) {
        this._save = save;
        this._load = load;
        this._all = all;
    }

    all(): Promise<RecordEvent[]> {
        return this._all();
    }

    load(streamId: string): Promise<RecordEvent[]> {
        return this._load(streamId);
    }

    save(streamId: string, expectedVersion: number, events: Event[]): (context: EventContext) => Promise<any> {
        return this._save(streamId, expectedVersion, events);
    }

}

export interface Save {
    (streamId: string, expectedVersion: number, events: Event[]): (context: EventContext) => Promise<any>;
}

export interface Load {
    (streamId: string): Promise<RecordEvent[]>;
}

export interface All {
    (): Promise<RecordEvent[]>;
}
