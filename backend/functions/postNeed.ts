import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { DynamoDB } from 'aws-sdk';

const esTable = process.env.EVENTSTORE_TABLE

const dynamoClient = new DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  var streamId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  var expectedVersion = Math.random()
  var syncTime = Date.now()
  await dynamoClient
      .put({
        TableName: esTable,
        Item: {
          commitId: syncTime + ':' + streamId,
          committedAt: syncTime,
          streamId: streamId,
          version: expectedVersion,
          active: 1, // using fixed partition like this is an anti-pattern which will be replaced
          events: JSON.stringify({name: "Hello it's me"})
        },
        ConditionExpression: 'attribute_not_exists(version)',
        ReturnValues: 'NONE'
      })
      .promise()
      .then(() => {
        console.log("Event saved")
        return {
          id: streamId
        }
      })
      .catch(err => {
        console.log("Can't save event")
        throw err
      })

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
      input: event,
    }, null, 2),
  };
}
