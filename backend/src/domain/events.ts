export type Event = HelloCreated | HelloChanged


export interface HelloCreated {
    kind: EventKinds.HelloCreated;
    userId: string;
    message: string;
}

export interface HelloChanged {
    kind: EventKinds.HelloChanged
    userId: string;
    newMessage: string;
}

export enum EventKinds {
    HelloCreated = "HelloCreated", HelloChanged = "HelloChanged"
}


