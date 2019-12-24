import {HelloService} from "../src/application/helloService";
import {All, EventStoreMock, Load, Save} from "./eventStoreMock";
import {EventKinds} from "../src/domain/events";
import {AggregateTypes} from "../src/domain/eventStore";

let helloService;
let save: Save;
let saveContext;
let load: Load;
let all: All;
const USER_ID = "user id";
const MESSAGE = "message";

beforeEach(() => {
    saveContext = jest.fn().mockImplementation(() => Promise.resolve(""));
    save = jest.fn().mockImplementationOnce(() => {
        return saveContext;
    });
    load = jest.fn().mockImplementationOnce(() => Promise.resolve([]));
    all = jest.fn().mockImplementationOnce(() => Promise.resolve([]));
    let eventStoreMock = new EventStoreMock(save, load, all);
    helloService = new HelloService(eventStoreMock);
})
describe("Creating hello:", () => {
    test("should create hello on message provided", () => {
        // when
        helloService.createHello(USER_ID, MESSAGE);
        // then
        expect(save).toBeCalledTimes(1);
        expect(save).toBeCalledWith(USER_ID, 0, [{
            kind: EventKinds.HelloCreated,
            userId: USER_ID,
            message: MESSAGE
        }])
        expect(saveContext).toBeCalledWith({
            correlationId: "1",
            causationId: "2",
            aggregate: AggregateTypes.Hello
        })
    })
})

describe("Changing hello:", () => {
    test("should change message to provided", () => {

    })
})


