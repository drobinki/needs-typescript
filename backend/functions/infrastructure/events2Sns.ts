import {SNS} from 'aws-sdk'

const sns = new SNS();

export const handler = (event, _, cb) => {

    console.log("ENVIRONMENT VARIABLES\n" + JSON.stringify(process.env, null, 2))
    console.info("EVENT\n" + JSON.stringify(event, null, 2))

    if (!event.Records[0].dynamodb.NewImage) {
        // ignore if something is deleted from dynamo manually
        return cb(null)
    }
    const streamId = event.Records[0].dynamodb.NewImage.streamId.S
    const version = event.Records[0].dynamodb.NewImage.version.N

    function sendEvent(topic): Promise<any> {
        return sns.publish({
            Message: JSON.stringify({
                streamId,
                version
            }),
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
