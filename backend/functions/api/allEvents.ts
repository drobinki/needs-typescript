import {APIGatewayProxyHandler} from "aws-lambda";
import {eventStore} from "../domain/eventStore";

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    console.log("All events")
    console.log(event)
    let all = await eventStore().all();
    return {
        statusCode: 200,
        body: JSON.stringify(all, null, 2),
    };
}
