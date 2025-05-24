import { SQSClient, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const sqs = new SQSClient({ region: process.env.AWS_REGION });
const sns = new SNSClient({ region: process.env.AWS_REGION });

const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;

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

            const sqsParams = new DeleteMessageCommand({
                QueueUrl: SQS_QUEUE_URL,
                ReceiptHandle: record.receiptHandle,
            });

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