import * as amqp from 'amqplib/callback_api';
import { baseConfig } from './config';

import { toJson, toString, isEmpty, isNotEmpty } from 'jnpl-helper';

const env = process.env.NODE_ENV || 'local';
const rabbitConfig = baseConfig.rabbit[env];

amqp.connect(`${rabbitConfig.host}:${rabbitConfig.port}`, (error0, connection) => {
    if (error0) {
        console.log('Error %s', toString(error0));
        return;
    }

    connection.createChannel((error1, channel) => {
        if (error1) {
            console.log('Error %s', toString(error1));
            return;
        }

        channel.assertQueue(baseConfig.logQueueName, { durable: true });
        channel.prefetch(1);

        console.log('Waiting for Messages in %s', baseConfig.logQueueName);
        channel.consume(baseConfig.logQueueName, (msg) => {
            if (msg !== null) {
                if (isEmpty(msg.properties.headers) || isEmpty(msg.properties.headers[baseConfig.secretKey]) || msg.properties.headers[baseConfig.secretKey] !== baseConfig.secretKeyHash) {
                    console.log('Invalid TOKEN');
                    channel.ack(msg);

                    return;
                }

                const msgContent = (msg.content) ? toJson(msg.content.toString()) : null;

                if (isNotEmpty(msgContent) && isNotEmpty(msgContent.action)) {
                    // logic iam thiking based on action to call diffirent logic
                    switch (msgContent.action.toLowerCase()) {
                        case 'submit':
                            console.log('Received SUBMIT %s', msgContent.data);
                        break;

                        case 'recieved':
                            console.log('Received RECIEVED %s', msgContent.data);
                        break;

                        case 'pending':
                            console.log('Received PENDING %s', msgContent.data);
                        break;

                        case 'completed':
                            console.log('Received COMPLETED %s', msgContent.data);
                        break;

                        default:
                            console.log('Received ERROR');
                    }
                    // logic iam thiking basede on action to call diffirent logic
                } else {
                    console.log('Received ERROR');
                }

                // delete on queue after 0.5 seconds
                setTimeout(() => {
                    channel.ack(msg);
                }, 500);
            }
        });
    });
});
