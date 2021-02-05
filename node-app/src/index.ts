import * as amqp from 'amqplib/callback_api';
import { baseConfig } from './config';

import { Helper } from './app/services/helper/helper.service';
import { QueueLogs } from './app/services/queue-logs/queue-logs.service';

const env = process.env.NODE_ENV || 'local';
const rabbitConfig = baseConfig.rabbit[env];

const helper: Helper = new Helper();
const queueLogs: QueueLogs = new QueueLogs(baseConfig);

amqp.connect(`${rabbitConfig.host}:${rabbitConfig.port}`, (error0, connection) => {
    if (error0) {
        console.log('Error %s', helper.toString(error0));
        return;
    }

    connection.createChannel((error1, channel) => {
        if (error1) {
            console.log('Error %s', helper.toString(error1));
            return;
        }

        channel.assertQueue(baseConfig.logQueueName, { durable: true });
        channel.prefetch(1);

        console.log('Waiting for Messages in %s', baseConfig.logQueueName);
        channel.consume(baseConfig.logQueueName, (msg) => {
            if (msg === null) {
                console.log('Invalid MESSAGE');
                channel.ack(msg);
                return;
            }

            if (helper.isEmpty(msg.properties.headers) || helper.isEmpty(msg.properties.headers[baseConfig.secretKey]) || msg.properties.headers[baseConfig.secretKey] !== baseConfig.secretKeyHash) {
                console.log('Invalid TOKEN');
                channel.ack(msg);
                return;
            }

            const msgContent = (msg.content) ? helper.toJson(msg.content.toString()) : null;
            if (helper.isEmpty(msgContent)) {
                console.log('Received ERROR');
                channel.ack(msg);
                return;
            }

            const updatedData: object = {
                'additionalData.isRead': false,
                'additionalData.isReceived': true,
                'additionalData.receivedBy': msgContent.id || '',
                'additionalData.receivedAt': new Date()
            };

            queueLogs.update(msg.properties.headers.token || '', msgContent.logId || '', updatedData)
                .then(
                    (queueLogData) => {
                        console.log('Message Confimation Receive %s', helper.toString(queueLogData));

                        // delete on queue after 0.5 seconds
                        setTimeout(() => {
                            channel.ack(msg);
                        }, 500);
                    }
                )
                .catch(
                    (error) => console.log
                );
        });
    });
});
