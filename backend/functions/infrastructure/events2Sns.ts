import {SNS} from 'aws-sdk'

const sns = new SNS();

export const handler = (event, _, cb) => {

    console.log("ENVIRONMENT VARIABLES\n" + JSON.stringify(process.env, null, 2))
    console.info("EVENT\n" + JSON.stringify(event, null, 2))

    if (!event.Records[0].dynamodb.NewImage) {
        // ignore if something is deleted from dynamo manually
        return cb(null)
    }
    const domainEvent = event.Records[0].dynamodb.NewImage.event.S

    function sendEvent(topic): Promise<any> {
        return sns.publish({
            Message: domainEvent,
            TopicArn: topic
        })
            .promise()
    }

    return sendEvent(process.env.DROBINKI_TOPIC)
        .then(() => {
            console.log("Message sent")
            cb(null)
        })
        .catch(err => {
            console.log(err)
            cb(err)
        })
}
