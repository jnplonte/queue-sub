import * as rabbitConfig from './rabbit-config.json';
import * as apiConfig from './api-config.json';

export const baseConfig = {
	name: 'queue subscriber',

	logQueueName: 'logJobs',

	secretKey: 'x-coupon-key',
	secretKeyHash: 'KuQmvnxXEjR7KXwfucgerTf6YwZV5Amz5awwxf5PFgkpGrb3Jn',

	rabbit: rabbitConfig,
	api: apiConfig,
};
