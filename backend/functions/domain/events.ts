
export type Event = HelloCreated | HelloChanged


export interface HelloCreated {
    kind: "HelloCreated";
    userId: String;
    message: String;
}

export interface HelloChanged {
    kind: "HelloChanged"
    userId: String;
    newMessage: String;
}


