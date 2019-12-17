import {EventStore} from "../domain/eventStore";
import {DynamoDB} from 'aws-sdk';
import {Event} from "../domain/events";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import {Context} from "./context";
import {v4 as uuid} from "uuid";
import {RecordEvent} from "./recordEvent";

const dynamoClient = new DynamoDB.DocumentClient()
const esTable = process.env.EVENTSTORE_TABLE

function toPut(event: DocumentClient.PutItemInput): DocumentClient.TransactWriteItem {
    return <DocumentClient.TransactWriteItem>{
        Put: <DocumentClient.Put>{
            TableName: event.TableName,
            Item: event.Item,
            ConditionExpression: event.ConditionExpression
        }
    }
}

function saveToDynamo(persistEvents: DocumentClient.PutItemInput[]): Promise<any> {
    return dynamoClient.transactWrite({
        TransactItems: persistEvents.map(toPut)
    })
    .promise()
    .then(() => {
        console.log("Event saved")
        return {}
    })
    .catch(err => {
        console.log("Can't save event")
        throw err
    })
}

function toPersisted(streamId: String, causationId: String, correlationId: String, aggregate: String, persistAt: number) {
    return (event: Event, version) => {
        return <DocumentClient.PutItemInput>{
            TableName: esTable,
            Item: {
                name: event.kind,
                commitId: persistAt + ':' + streamId,
                committedAt: persistAt,
                streamId: streamId,
                version: version,
                causationId: causationId,
                correlationId: correlationId,
                aggregate: aggregate,
                messageId: uuid(),
                active: 1, // using fixed partition like this is an anti-pattern which will be replaced
                event: JSON.stringify(event)
            },
            ReturnValues: 'NONE'
        }
    }
}

export class DynamoEventStore implements EventStore {

    save(streamId: String, expectedVersion: number, events: Event[]): (Context) => Promise<any> {
        return (context: Context) => {
            const now = Date.now();
            const toPersistEvent = toPersisted(streamId, context.causationId, context.correlationId, context.aggregate, now)
            return saveToDynamo(
                events
                    .map((event, index) => {
                        console.log('Persisting the event')
                        console.log(event);
                        console.log(expectedVersion + index + 1)
                        let putItemInput = toPersistEvent(event, expectedVersion + index + 1);
                        console.log(putItemInput)
                        return putItemInput
                    })
            )
        }
    }

    all(): Promise<RecordEvent[]> {
        console.log("Loading events");
        return dynamoClient.scan({
            TableName: esTable,
            ConsistentRead: true,
        })
            .promise()
            .then(res => {
                return res.Items
                    .map((item) => {
                        return <RecordEvent> {
                            ...item
                        }
                    })
            })

    }

    load(streamId: String, version: Number = 0): Promise<RecordEvent[]> {
        console.log("Loading events");
        return dynamoClient.query({
            TableName: esTable,
            ConsistentRead: true,
            KeyConditionExpression: 'streamId = :a AND version >= :v',
            ExpressionAttributeValues: {
                ':a': streamId,
                ':v': version
            }
        })
        .promise()
            .then(res => {
                return res.Items
                    .map((item) => {
                        console.log("Loaded event");
                        console.log(item);
                        return <RecordEvent> {
                            ...item
                        }
                    })
        })

    }
}
