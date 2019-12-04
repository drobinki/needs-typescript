import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import {eventStore} from '../domain/eventStore'
import {createHello} from "../domain/createHello";


export const handler: APIGatewayProxyHandler = async (event, _context) => {
    console.log("Create hello")
    console.log(event)
    var command = JSON.parse(event.body)
    var events = createHello(command.userId, command.message)
    await eventStore().save(command.userId, 0, events)({
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
