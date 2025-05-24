import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const SNS_TOPIC_ARN = "arn:aws:sns:eu-west-1:442042506417:VK-UploadsNotificationTopic";
const AWS_REGION = "eu-west-1";

const sns = new SNSClient({ region: AWS_REGION });

export async function handler(event) {
    console.log('Received event:', JSON.stringify(event, null, 2));

    for (const record of event.Records) {
        try {
            const snsParams = new PublishCommand({
                Message: record.Message,
                TopicArn: SNS_TOPIC_ARN,
            });

            await sns.send(snsParams);
            console.log("Message published to SNS:", message);

            await sqs.send(sqsParams);
            console.log(`Message deleted from SQS: ${record.messageId}`);
        } catch (error) {
            console.error("Error processing messages:", error);
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Messages processed successfully!' }),
    };
}