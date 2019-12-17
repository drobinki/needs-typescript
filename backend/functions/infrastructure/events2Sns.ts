import {SNS} from 'aws-sdk'
import {RecordList, Record} from "aws-sdk/clients/dynamodbstreams";
import {RecordEvent} from "./recordEvent";

const sns = new SNS();

function toMessages(Records: RecordList): RecordEvent[] {
    return Records
        .map((record ) => {
            return toMessage(record)
        })
}

function toMessage(record: Record): RecordEvent {
    let event = Object.entries(record.dynamodb.NewImage)
        .map( ([key, property]) => {
            return [key, (property["S"] || property["N"])]
        })
        .reduce((acc, [key, value]) => {
            acc[key] = value
            return acc
        }, {})
    return <RecordEvent> event
}

function sendEvent(topic: string, recorderEvent: RecordEvent): Promise<any> {
    return sns.publish({
        Message: JSON.stringify({
            metadata: {
                version: recorderEvent.version
            },
            name: recorderEvent.name,
            streamId: recorderEvent.streamId,
            messageId: recorderEvent.messageId,
            aggregate: recorderEvent.aggregate,
            event: JSON.parse(recorderEvent.event)
        }),
        TopicArn: topic
    })
    .promise()
}

export const handler = (event, _, cb) => {

    console.log("ENVIRONMENT VARIABLES\n" + JSON.stringify(process.env, null, 2))
    console.info("EVENT\n" + JSON.stringify(event, null, 2))

    if (!event.Records[0].dynamodb.NewImage) {
        // ignore if something is deleted from dynamo manually
        return cb(null)
    }

    return Promise.all(toMessages(event.Records)
        .map((recordedEvent) => sendEvent(process.env.DROBINKI_TOPIC, recordedEvent))
    )
    .then(() => {
        console.log("Message sent")
        cb(null)
    })
    .catch(err => {
        console.log(err)
        cb(err)
    })
}
