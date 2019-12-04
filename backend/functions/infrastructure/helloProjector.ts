import {SQSEvent} from "aws-lambda";
import {HelloChanged, HelloCreated} from "../domain/events";
import {HelloView} from "../domain/helloView";
import { helloViewRepository } from "../domain/helloViewRepository";

function apply(hello: HelloView, event: any): HelloView {
    switch (event.type) {
        case HelloCreated.name: {
           return {
               userId: event.getUserId(),
               comment: event.message
           }
        }
        case HelloChanged.name: {
            return {
                userId: hello.userId,
                comment: event.newMessage
            }
        }
    }
}

function updateView(event: any) {
    console.log("Loading user view")
    console.log(event)
    return helloViewRepository().load(event.userId)
        .then((helloView) => {
            console.log("Before apply event")
            console.log(helloView)
            let newHelloView = apply(helloView, event)
            console.log("After apply event")
            console.log(newHelloView)
            return helloViewRepository().save(newHelloView)
        })
}

//TODO think about filtering the events
export const handler = async (event: SQSEvent, _) => {
    console.info("EVENT\n" + JSON.stringify(event, null, 2))
    var allEvents = event.Records
        .map((record) => {
            var body = JSON.parse(record.body)
            return body.Message
        });
    await Promise.all(allEvents.map((event) => updateView(event)))
    console.info("EVENT\n" + JSON.stringify(event, null, 2))
}
