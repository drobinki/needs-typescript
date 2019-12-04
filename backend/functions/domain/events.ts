
export type Event = HelloCreated | HelloChanged


export class HelloCreated {
    type = "HelloCreated";

    constructor(private userId: string, private message: string) {}

    getUserId(): string {
        return this.userId;
    }

    getMessage(): string {
        return this.message;
    }
}

export class HelloChanged {

    type = "HelloCreated"

    constructor(private userId: string, private newMessage: string) {}

    getUserId(): string {
        return this.userId;
    }

    getNewMessage(): string {
        return this.newMessage;
    }
}


