import {AggregateTypes, eventStore, EventStore} from "../domain/eventStore";
import {changeHello, createHello, toHello} from "../domain/hello";

export class HelloService {
    private eventStore: EventStore;

    constructor(eventStore: EventStore) {
        this.eventStore = eventStore;
    }

    async createHello(userId:string, message:string){
        let events = createHello(userId, message);
        await this.eventStore.save(userId, 0, events)({
            correlationId: "1",
            causationId: "2",
            aggregate: AggregateTypes.Hello
        })
    }

    async changeHello(userId: string, newMessage: string) {
        var hello = await eventStore().load(userId)
            .then((recordEvents) => {
                return toHello(recordEvents);
            });
        let events = changeHello(hello, newMessage);
        await eventStore().save(userId, hello.version, events)({
            correlationId: "1",
            causationId: "2",
            aggregate: AggregateTypes.Hello
        });
    }

}
