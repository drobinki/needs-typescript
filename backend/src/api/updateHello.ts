import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import {AggregateTypes, eventStore} from '../domain/eventStore'
import {changeHello, toHello} from "../domain/hello";


export const handler: APIGatewayProxyHandler = async (event, _context) => {
    console.log("Update hello")
    console.log(event)
    var command = JSON.parse(event.body)
    var hello = await eventStore().load(command.userId)
        .then( (recordEvents) => {
            return toHello(recordEvents);
        });
    let events = changeHello(hello, command.newMessage);
    await eventStore().save(command.userId, hello.version, events)({
        correlationId: "1",
        causationId: "2",
        aggregate: AggregateTypes.Hello
    });
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
            input: event,
        }, null, 2),
    };
}
