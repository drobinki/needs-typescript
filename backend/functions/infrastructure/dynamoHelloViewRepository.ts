import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import { HelloViewRepository } from "../domain/helloViewRepository";
import {DynamoDB} from "aws-sdk";
import {HelloView} from "../domain/helloView";

const dynamoClient = new DynamoDB.DocumentClient()
const helloTable = process.env.HELLO_TABLE

function toPutItem(hello: HelloView){
    return <DocumentClient.PutItemInput>{
        TableName: helloTable,
        Item: {
            userId: hello.userId,
            comment: hello.comment
        },
        ReturnValues: 'NONE'
    }
}

export class DynamoHelloViewRepository implements HelloViewRepository {
    load(userId: String): Promise<HelloView> {
        console.log(helloTable)
        console.log(userId)
        return dynamoClient.get({
            TableName: helloTable,
            Key: {
                'userId': userId
            }
        }).promise()
            .then((res) => {
                return <HelloView> res.Item
            })
    }

    all(): Promise<HelloView[]> {
        return dynamoClient.scan({
            TableName: helloTable,
            ConsistentRead: true,
        }).promise()
            .then((res) => {
                return res.Items
                    .map((item) => {
                        return <HelloView> {
                            ...item
                        }
                    })
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
