import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import { HelloViewRepository } from "../domain/helloViewRepository";
import {DynamoDB} from "aws-sdk";
import {HelloView} from "../domain/helloView";

const dynamoClient = new DynamoDB.DocumentClient()

function toPutItem(hello: HelloView){
    return <DocumentClient.PutItemInput>{
        TableName: "HelloTable",
        Item: {
            userId: hello.userId,
            comment: hello.comment
        },
        ConditionExpression: 'attribute_not_exists(version)',
        ReturnValues: 'NONE'
    }
}

export class DynamoHelloViewRepository implements HelloViewRepository {
    load(userId: String): Promise<HelloView> {
        return dynamoClient.query({
            TableName: "HelloTable",
            ConsistentRead: true,
            KeyConditionExpression: 'userId = :a',
            ExpressionAttributeValues: {
                ':a': { S: userId }
            }
        }).promise()
            .then((res) => {
                return res.Items
                    .map((item) => {
                        return <HelloView> {
                            ...item
                        }
                    })
                    .shift()
            })
    }

    save(hello: HelloView): Promise<any> {
        return dynamoClient.put(toPutItem(hello))
            .promise()
            .then(() => {
                console.log("Hello view saved")
                return {}
            })
            .catch(err => {
                console.log("Can't save hello view")
                console.log(err)
                throw err
            })
    }
}
