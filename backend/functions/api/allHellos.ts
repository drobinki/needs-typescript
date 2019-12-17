import {APIGatewayProxyHandler} from "aws-lambda";
import {helloViewRepository} from "../domain/helloViewRepository";



export const handler: APIGatewayProxyHandler = async (event, _context) => {
    console.log("All hellos")
    console.log(event)
    let all = await helloViewRepository().all();
    return {
        statusCode: 200,
        body: JSON.stringify(all, null, 2),
    };
}
