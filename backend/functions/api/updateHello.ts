import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { eventStore } from '../domain/eventStore'
import {toHello} from "../infrastructure/hello";
import {changeHello} from "../domain/changeHello";

const userId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    console.log("Update hello")
    console.log(event)
    var command = JSON.parse(event.body)
    var hello = await eventStore().load(userId)
        .then( (recordEvents) => {
            return <Hello> toHello(recordEvents);
        });
    let events = changeHello(hello, command.newComment);
    eventStore().save(userId, 1, events)({
        correlationId: "1",
        causationId: "2",
        aggregate: "Hello"
    });
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
            input: event,
        }, null, 2),
    };
}
