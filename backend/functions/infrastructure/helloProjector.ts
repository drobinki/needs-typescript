import {SQSEvent} from "aws-lambda";
import {HelloView} from "../domain/helloView";
import { helloViewRepository } from "../domain/helloViewRepository";

function apply(hello: HelloView, message: any): HelloView {
    let event  = message.event
    console.log(event.type)
    switch (event.kind) {
        case "HelloCreated": {
           return {
               userId: event.userId,
               version: message.version,
               comment: event.message
           }
        }
        case "HelloChanged": {
            return {
                userId: hello.userId,
                version: message.version,
                comment: event.newMessage
            }
        }
    }
}

function updateView(message: any) {
    console.log("Loading user view")
    console.log(message)
    return helloViewRepository().load(message.event.userId)
        .then((helloView) => {
            let newHelloView = apply(helloView || <HelloView> {}, message)
            return helloViewRepository().save(newHelloView)
        })
}

//TODO think about filtering the events
export const handler = async (event: SQSEvent, _) => {
    console.info("EVENT\n" + JSON.stringify(event, null, 2))
    var allEvents = event.Records
        .map((record) => {
            var body = JSON.parse(record.body)
            return JSON.parse(body.Message)
        });
    await Promise.all(allEvents.map((event) => updateView(event)))
        .then((_) => {
            console.log("I did it, view is saved");
        })
        .catch((err) => {
            console.log("Failing to persist view")
            console.log(err);
        })
    console.info("EVENT\n" + JSON.stringify(event, null, 2))
}
